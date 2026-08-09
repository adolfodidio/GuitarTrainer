// js/utils/audio-analyzer.js
import { noteFromPitch, getNoteName } from './music-data.js';

let audioContext = null;
let analyser = null;
let microphoneStream = null;

export function getAudioContext() {
    return audioContext;
}

export function playTargetNote(frequency) {
    if (!audioContext) return;
    const t = audioContext.currentTime;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 4, t);
    filter.frequency.exponentialRampToValueAtTime(frequency, t + 0.5);

    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(t);
    oscillator.stop(t + 2.0);
}

function autoCorrelate(buf, sampleRate) {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) { rms += buf[i] * buf[i]; }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    buf = buf.slice(r1, r2);
    SIZE = buf.length;
    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++) 
        for (let j = 0; j < SIZE - i; j++)
            c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
        if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    }
    let T0 = maxpos;
    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
    return sampleRate / T0;
}

export async function initAudio(onPitchUpdate) {
    try {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') await audioContext.resume();
        
        if (!microphoneStream) {
            microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        
        if (!analyser) {
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            const source = audioContext.createMediaStreamSource(microphoneStream);
            source.connect(analyser);
        }

        function updatePitch() {
            if (!analyser) return;
            const buf = new Float32Array(analyser.fftSize);
            analyser.getFloatTimeDomainData(buf);
            const freq = autoCorrelate(buf, audioContext.sampleRate);
            
            if (freq !== -1) {
                const midiNum = noteFromPitch(freq);
                const noteNameDisplay = getNoteName(midiNum);
                onPitchUpdate(freq, midiNum, noteNameDisplay);
            } else {
                onPitchUpdate(-1, null, null);
            }
            requestAnimationFrame(updatePitch);
        }
        
        requestAnimationFrame(updatePitch);
        return true;
    } catch (e) { 
        console.error("Microfono negato", e); 
        return false;
    }
}

export function stopAudio() {
    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        microphoneStream = null;
    }
    analyser = null;
}

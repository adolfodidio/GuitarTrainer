// js/modules/vocal-trainer.js
import { initAudio, stopAudio, playTargetNote, playDrone, stopDrone, getAudioContext } from '../utils/audio-analyzer.js';
import { NOTES_DISPLAY, INTERVALS, frequencyFromNoteNumber } from '../utils/music-data.js';

let currentTab = 1;
let isMicActive = false;
let currentTargetNote = null;
let currentTargetFreq = null;
let currentRootNote = null; // for mode 2 and 3

const DOM = {
    btnStart: document.getElementById('btn-start'),
    btnStop: document.getElementById('btn-stop'),
    targetLabel: document.getElementById('target-label'),
    targetNote: document.getElementById('target-note'),
    targetInterval: document.getElementById('target-interval'),
    indicator: document.getElementById('tuner-indicator'),
    status: document.getElementById('tuning-status'),
    centsDisplay: document.getElementById('cents-display'),
    droneRoot: document.getElementById('drone-root'),
    droneInterval: document.getElementById('drone-interval')
};

// Expose to window for inline handlers
window.selectTab = selectTab;
window.startMic = startMic;
window.stopMic = stopMic;
window.generateNewPitch = generateNewPitch;
window.playCurrentTarget = playCurrentTarget;
window.updateDrone = updateDrone;
window.updateDroneTarget = updateDroneTarget;
window.generateIntervalChallenge = generateIntervalChallenge;

function selectTab(index) {
    currentTab = index;
    
    // Update buttons
    for(let i=1; i<=3; i++) {
        document.getElementById(`btn-tab-${i}`).classList.toggle('active', i === index);
        document.getElementById(`pane-${i}`).classList.toggle('active', i === index);
    }

    if (index === 2) {
        if (isMicActive) startDronePlay();
    } else {
        stopDrone();
    }

    resetTuner();
    setupTabMode();
}

function setupTabMode() {
    DOM.targetInterval.classList.add('hidden-section');
    if (currentTab === 1) {
        DOM.targetLabel.innerText = "Canta questa nota:";
        if (!currentTargetNote) generateNewPitch();
    } else if (currentTab === 2) {
        DOM.targetLabel.innerText = "Canta l'intervallo:";
        updateDroneTarget();
    } else if (currentTab === 3) {
        DOM.targetLabel.innerText = "Sfida Intervallo:";
        DOM.targetInterval.classList.remove('hidden-section');
        if (!currentTargetNote) generateIntervalChallenge();
    }
}

async function startMic() {
    const success = await initAudio(onPitchUpdate);
    if (success) {
        isMicActive = true;
        DOM.btnStart.classList.add('hidden-section');
        DOM.btnStop.classList.remove('hidden-section');
        if (currentTab === 2) startDronePlay();
    } else {
        alert("Impossibile accedere al microfono.");
    }
}

function stopMic() {
    stopAudio();
    stopDrone();
    isMicActive = false;
    DOM.btnStart.classList.remove('hidden-section');
    DOM.btnStop.classList.add('hidden-section');
    resetTuner();
}

function resetTuner() {
    DOM.indicator.style.left = '50%';
    DOM.indicator.style.backgroundColor = 'white';
    DOM.status.innerText = "Waiting...";
    DOM.status.className = "vt-status text-gray";
    DOM.centsDisplay.innerText = "-- cents";
}

function onPitchUpdate(freq, midiNum, noteNameDisplay, cents) {
    if (!isMicActive) return;

    if (freq === -1) {
        // No pitch detected
        resetTuner();
        return;
    }

    // Check if we have a specific target
    if (currentTargetNote !== null) {
        // Calculate cents relative to TARGET note, not nearest note
        // The audio-analyzer gives cents relative to the NEAREST note.
        // We need to calculate it against currentTargetNote
        const targetFreq = frequencyFromNoteNumber(currentTargetNote);
        let absoluteCents = Math.floor(1200 * Math.log2(freq / targetFreq));
        
        // Clamp between -50 and 50 for the display
        let displayCents = absoluteCents;
        if (displayCents < -50) displayCents = -50;
        if (displayCents > 50) displayCents = 50;

        // Map -50..50 to 0%..100%
        const posPercent = ((displayCents + 50) / 100) * 100;
        DOM.indicator.style.left = `${posPercent}%`;
        DOM.centsDisplay.innerText = `${absoluteCents > 0 ? '+' : ''}${absoluteCents} cents`;

        if (Math.abs(absoluteCents) <= 10) {
            DOM.indicator.style.backgroundColor = '#10b981';
            DOM.status.innerText = "PERFETTO!";
            DOM.status.className = "vt-status text-green";
        } else if (Math.abs(absoluteCents) <= 25) {
            DOM.indicator.style.backgroundColor = '#f59e0b';
            DOM.status.innerText = absoluteCents > 0 ? "CRESCENTE (Sharp)" : "CALANTE (Flat)";
            DOM.status.className = "vt-status text-yellow";
        } else {
            DOM.indicator.style.backgroundColor = '#ef4444';
            DOM.status.innerText = absoluteCents > 0 ? "TROPPO CRESCENTE" : "TROPPO CALANTE";
            DOM.status.className = "vt-status text-red";
        }
    }
}

// Mode 1: Pitch Matching
function generateNewPitch() {
    // Generate note between C3 (48) and C5 (72)
    currentTargetNote = Math.floor(Math.random() * (72 - 48 + 1)) + 48;
    currentTargetFreq = frequencyFromNoteNumber(currentTargetNote);
    DOM.targetNote.innerText = NOTES_DISPLAY[currentTargetNote % 12];
}

function playCurrentTarget() {
    if (!getAudioContext()) {
        alert("Devi prima avviare il microfono per usare l'audio.");
        return;
    }
    if (currentTargetFreq) playTargetNote(currentTargetFreq);
}

// Mode 2: Drone
function populateDroneSelects() {
    NOTES_DISPLAY.forEach((note, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.text = note;
        if (note === 'DO') opt.selected = true;
        DOM.droneRoot.appendChild(opt);
    });

    INTERVALS.forEach((int, index) => {
        const opt = document.createElement('option');
        opt.value = int.semitones;
        opt.text = `${int.name} (${int.abbr})`;
        if (int.abbr === '5') opt.selected = true;
        DOM.droneInterval.appendChild(opt);
    });
}

function updateDroneTarget() {
    const rootIndex = parseInt(DOM.droneRoot.value);
    const intervalSemitones = parseInt(DOM.droneInterval.value);
    
    // Choose a comfortable octave, e.g., octave 3 (base 48)
    currentRootNote = 48 + rootIndex; 
    currentTargetNote = currentRootNote + intervalSemitones;
    currentTargetFreq = frequencyFromNoteNumber(currentTargetNote);

    DOM.targetNote.innerText = NOTES_DISPLAY[currentTargetNote % 12];
    if (currentTab === 2 && isMicActive) {
        startDronePlay();
    }
}

function updateDrone() {
    updateDroneTarget();
}

function startDronePlay() {
    if (!currentRootNote) return;
    const rootFreq = frequencyFromNoteNumber(currentRootNote);
    playDrone(rootFreq);
}

// Mode 3: Intervals Challenge
function generateIntervalChallenge() {
    // Random root C3 to G3
    currentRootNote = Math.floor(Math.random() * 8) + 48; 
    
    // Random interval (1 to 12)
    const intIndex = Math.floor(Math.random() * 12) + 1; // skip unison
    const interval = INTERVALS[intIndex];

    currentTargetNote = currentRootNote + interval.semitones;
    currentTargetFreq = frequencyFromNoteNumber(currentTargetNote);

    DOM.targetNote.innerText = `?`;
    DOM.targetInterval.innerText = `Canta: ${interval.name} da ${NOTES_DISPLAY[currentRootNote % 12]}`;

    // Play root to give context
    setTimeout(() => {
        if (getAudioContext()) playTargetNote(frequencyFromNoteNumber(currentRootNote));
    }, 100);
}

// Init
populateDroneSelects();
setupTabMode();

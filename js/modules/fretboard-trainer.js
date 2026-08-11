// js/modules/fretboard-trainer.js
import { NOTES_DISPLAY, STRINGS_DATA, INTERVALS, frequencyFromNoteNumber, getNoteName } from '../utils/music-data.js';
import { isWaitingForSpeech, speakFeedback, speakAndPlay } from '../utils/speech.js';
import { initAudio, stopAudio, playTargetNote } from '../utils/audio-analyzer.js';

let isMicInitialized = false;
let isListening = false;
let config = {};
let session = {
    tests: [],
    currentTestIndex: 0,
    correctCount: 0,
    totalTime: 0,
    timerInterval: null,
    timeLeft: 0,
    startTime: 0,
    activeNote: null
};
let pitchBuffer = [];

// Initialize strings UI
export function initStringsUI() {
    const container = document.getElementById('strings-container');
    if (!container) return;
    const tpl = document.getElementById('string-tpl').innerHTML;
    for(let i=1; i<=6; i++) {
        container.innerHTML += tpl.replace(/{{id}}/g, i);
    }
}

export function startSession() {
    const selectedStrings = [];
    for(let i=1; i<=6; i++) {
        if(document.getElementById(`str${i}`).checked) selectedStrings.push(i);
    }
    if(selectedStrings.length === 0) { 
        alert("Seleziona almeno una corda per iniziare!");
        return; 
    }

    if (!isMicInitialized) {
        alert("Devi prima avviare il microfono (pulsante in alto) per poter giocare!");
        return;
    }

    config.numTests = parseInt(document.getElementById('numTests').value);
    config.fretStart = parseInt(document.getElementById('fretStart').value);
    config.fretEnd = parseInt(document.getElementById('fretEnd').value);
    config.scaleType = document.getElementById('scaleType').value;
    config.timeLimit = parseInt(document.getElementById('timeLimit').value);
    config.testMode = document.getElementById('testMode').value;
    config.selectedStrings = selectedStrings;

    document.getElementById('settings-panel').classList.add('hidden-section');
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownText = document.getElementById('countdown-text');
    countdownOverlay.classList.remove('hidden-section');

    // L'audio è già stato inizializzato dal pulsante "Avvia Microfono"


    let count = 5;

    function doCountdown() {
        if (count > 0) {
            countdownText.innerText = count;
            countdownText.classList.remove('countdown-tick');
            void countdownText.offsetWidth; 
            countdownText.classList.add('countdown-tick');
            
            count--;
            setTimeout(doCountdown, 1000);
        } else {
            countdownOverlay.classList.add('hidden-section');
            document.getElementById('results-panel').classList.add('hidden-section');
            document.getElementById('game-panel').classList.remove('hidden-section');
            
            isListening = true;
            session.currentTestIndex = 0;
            session.correctCount = 0;
            session.totalTime = 0;
            session.tests = [];
            nextTest();
        }
    }

    doCountdown();
}

function handlePitchUpdate(freq, midiNum, noteNameDisplay) {
    if (!isListening) return;
    const freqDisplay = document.getElementById("detectedFreq");
    const noteDisplay = document.getElementById("detectedNote");

    if (freq !== -1) {
        freqDisplay.innerText = Math.round(freq) + " Hz";
        noteDisplay.innerText = noteNameDisplay;

        if (!isWaitingForSpeech && session.activeNote) {
            if (midiNum === session.activeNote.targetMidi) {
                pitchBuffer.push(midiNum);
                if (pitchBuffer.length >= 5) {
                    endTest(true);
                    pitchBuffer = [];
                }
            } else {
                pitchBuffer = [];
            }
        }
    } else {
        pitchBuffer = [];
    }
}

function nextTest() {
    if (session.currentTestIndex >= config.numTests) { finishSession(); return; }
    session.currentTestIndex++;
    updateProgressBar();
    
    let valid = false;
    let strObj, fret, baseMidi, baseNoteName, baseNoteSpeech;
    const availableStrings = STRINGS_DATA.filter(s => config.selectedStrings.includes(s.id));

    while (!valid) {
        strObj = availableStrings[Math.floor(Math.random() * availableStrings.length)];
        fret = Math.floor(Math.random() * (config.fretEnd - config.fretStart + 1)) + config.fretStart;
        baseMidi = strObj.baseMidi + fret;
        baseNoteName = getNoteName(baseMidi);
        baseNoteSpeech = getNoteName(baseMidi, true);
        if (config.scaleType === 'diatonic') {
            if (!baseNoteName.includes('#')) valid = true;
        } else {
            valid = true;
        }
    }

    let targetMidi, targetNoteName, targetNoteSpeech, intervalObj = null;

    if (config.testMode === 'interval') {
        intervalObj = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
        targetMidi = baseMidi + intervalObj.semitones;
        targetNoteName = getNoteName(targetMidi);
        targetNoteSpeech = getNoteName(targetMidi, true);
        document.getElementById('modeLabel').innerText = "Trova l'intervallo";
        document.getElementById('questionText').innerHTML = `<span class="text-2xl block text-indigo-300 font-normal">${intervalObj.name} di</span>${baseNoteName}<br><span class="text-xl text-indigo-400 font-semibold uppercase tracking-widest">Corda ${strObj.id}</span>`;
        
        session.activeNote = { 
            targetName: targetNoteName, targetSpeech: targetNoteSpeech,
            targetMidi: targetMidi, stringId: strObj.id, fret: fret
        };
        
        speakAndPlay(`Trova la ${intervalObj.name} di ${baseNoteSpeech}, sulla corda ${strObj.id}`, frequencyFromNoteNumber(baseMidi), playTargetNote, startQuestionTimer);
    } else {
        targetMidi = baseMidi;
        targetNoteName = baseNoteName;
        targetNoteSpeech = baseNoteSpeech;
        document.getElementById('modeLabel').innerText = "Trova la nota";
        document.getElementById('questionText').innerHTML = `${baseNoteName}<br><span class="text-xl text-indigo-400 font-semibold uppercase tracking-widest">Corda ${strObj.id}</span>`;
        
        session.activeNote = { 
            targetName: targetNoteName, targetSpeech: targetNoteSpeech,
            targetMidi: targetMidi, stringId: strObj.id, fret: fret
        };

        speakAndPlay(`${baseNoteSpeech}, sulla corda ${strObj.id}`, frequencyFromNoteNumber(baseMidi), playTargetNote, startQuestionTimer);
    }

    document.getElementById('detectedNote').innerText = "--";
    pitchBuffer = [];
    document.getElementById('timerDisplay').innerText = config.timeLimit;
}

function startQuestionTimer() {
    session.startTime = Date.now();
    session.timeLeft = config.timeLimit;
    document.getElementById('timerDisplay').innerText = session.timeLeft;

    if (session.timerInterval) clearInterval(session.timerInterval);
    session.timerInterval = setInterval(() => {
        session.timeLeft--;
        document.getElementById('timerDisplay').innerText = session.timeLeft;
        if (session.timeLeft <= 0) endTest(false);
    }, 1000);
}

function endTest(success) {
    if (isWaitingForSpeech) return;
    
    clearInterval(session.timerInterval);
    const timeTaken = (Date.now() - session.startTime) / 1000;
    
    session.totalTime += Math.min(timeTaken, config.timeLimit);
    session.tests.push({ 
        note: session.activeNote.targetName, 
        success: success, time: timeTaken,
        stringId: session.activeNote.stringId, fret: session.activeNote.fret
    });

    if (success) {
        session.correctCount++;
        document.body.classList.add('flash-success');
        speakFeedback("Corretto");
    } else {
        document.body.classList.add('flash-fail');
        speakFeedback(`Sbagliato.`);
    }

    session.activeNote = null; 
    setTimeout(() => {
        document.body.classList.remove('flash-success', 'flash-fail');
        if (isListening) nextTest();
    }, 1800);
}

function updateProgressBar() {
    const pct = Math.max(0, ((session.currentTestIndex - 1) / config.numTests) * 100);
    document.getElementById('progressBar').style.setProperty('--progress-width', `${pct}%`);
}

export function finishSession() {
    isListening = false;
    clearInterval(session.timerInterval);
    stopAudio();
    
    document.getElementById('game-panel').classList.add('hidden-section');
    document.getElementById('settings-panel').classList.add('hidden-section');
    document.getElementById('results-panel').classList.remove('hidden-section');
    
    const total = session.tests.length;
    const accuracy = total > 0 ? Math.round((session.correctCount / total) * 100) : 0;
    const avgTime = total > 0 ? (session.totalTime / total).toFixed(1) : 0;
    document.getElementById('resultAccuracy').innerText = `${accuracy}%`;
    document.getElementById('resultAvgTime').innerText = `${avgTime}s`;
    
    renderCharts();
    renderSessionLog();
    renderFretboardHeatmap();
}

function renderFretboardHeatmap() {
    const container = document.getElementById('fretboardHeatmap');
    const fretsCount = config.fretEnd - config.fretStart + 1;
    const startFret = config.fretStart;
    const endFret = config.fretEnd;

    const map = {};
    let maxHits = 0;
    
    session.tests.forEach(t => {
        const key = `${t.stringId}-${t.fret}`;
        map[key] = (map[key] || 0) + 1;
        if(map[key] > maxHits) maxHits = map[key];
    });

    let html = `<div style="display: grid; grid-template-columns: 20px repeat(${fretsCount}, minmax(28px, 1fr)); gap: 2px;">`;
    html += `<div></div>`;
    for(let f=startFret; f<=endFret; f++) {
        html += `<div class="text-center text-[10px] text-gray-500 font-mono">${f}</div>`;
    }

    for(let s=1; s<=6; s++) {
        html += `<div class="flex items-center justify-center text-[10px] font-bold text-gray-400">${s}</div>`;
        for(let f=startFret; f<=endFret; f++) {
            const hits = map[`${s}-${f}`] || 0;
            let bgStyle = 'background-color: rgba(31, 41, 55, 0.5)';
            let border = 'border-gray-700';

            if (hits > 0) {
                 const intensity = hits / maxHits; 
                 const alpha = 0.3 + (intensity * 0.7);
                 bgStyle = `background-color: rgba(34, 197, 94, ${alpha})`;
                 border = 'border-green-900';
            }

            const tooltip = `Corda ${s}, Tasto ${f}: ${hits} volte`;
            html += `<div class="aspect-square rounded-sm border ${border} flex items-center justify-center text-[9px] fret-cell" style="${bgStyle}" title="${tooltip}">${hits > 0 ? hits : ''}</div>`;
        }
    }
    html += `</div>`;
    container.innerHTML = html;
}

function renderCharts() {
    let noteStats = {};
    NOTES_DISPLAY.forEach(n => noteStats[n] = { correct: 0, total: 0 });
    let stringStats = {};
    [1,2,3,4,5,6].forEach(s => stringStats[s] = { correct: 0, total: 0 });

    session.tests.forEach(t => {
        const cleanNote = t.note.replace(/[0-9-]/g, '');
        if(noteStats[cleanNote]) {
            noteStats[cleanNote].total++;
            if(t.success) noteStats[cleanNote].correct++;
        }
        if(stringStats[t.stringId]) {
            stringStats[t.stringId].total++;
            if(t.success) stringStats[t.stringId].correct++;
        }
    });

    const noteLabels = Object.keys(noteStats).filter(n => noteStats[n].total > 0);
    const noteData = noteLabels.map(n => (noteStats[n].correct / noteStats[n].total) * 100);
    const ctxNote = document.getElementById('statsChart').getContext('2d');
    if (window.Chart) {
        const oldChartNote = window.Chart.getChart("statsChart");
        if (oldChartNote) oldChartNote.destroy();
        new window.Chart(ctxNote, {
            type: 'bar',
            data: {
                labels: noteLabels,
                datasets: [{
                    data: noteData,
                    backgroundColor: noteData.map(v => v >= 80 ? '#4ade80' : (v >= 50 ? '#facc15' : '#f87171')),
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        const stringLabels = Object.keys(stringStats).filter(s => stringStats[s].total > 0).map(s => `Corda ${s}`);
        const stringData = Object.keys(stringStats).filter(s => stringStats[s].total > 0).map(s => (stringStats[s].correct / stringStats[s].total) * 100);
        const ctxString = document.getElementById('stringsChart').getContext('2d');
        const oldChartString = window.Chart.getChart("stringsChart");
        if (oldChartString) oldChartString.destroy();
        new window.Chart(ctxString, {
            type: 'bar',
            data: {
                labels: stringLabels,
                datasets: [{
                    data: stringData, backgroundColor: '#6366f1', borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
}

function renderSessionLog() {
    const logContainer = document.getElementById('sessionLog');
    let noteCounts = {};
    let stringCounts = {};

    session.tests.forEach(t => {
        noteCounts[t.note] = (noteCounts[t.note] || 0) + 1;
        stringCounts[t.stringId] = (stringCounts[t.stringId] || 0) + 1;
    });

    let logHtml = `<div class="grid grid-cols-2 gap-4">`;
    logHtml += `<div><p class="text-[9px] text-gray-500 uppercase font-bold mb-1">Dettaglio Note</p><ul class="space-y-1">`;
    Object.keys(noteCounts).sort().forEach(note => {
        logHtml += `<li class="flex justify-between border-b border-gray-800 pb-0.5">
            <span class="text-indigo-300 font-bold">${note}</span>
            <span class="text-gray-500">${noteCounts[note]} ${noteCounts[note] === 1 ? 'volta' : 'volte'}</span>
        </li>`;
    });
    logHtml += `</ul></div>`;

    logHtml += `<div><p class="text-[9px] text-gray-500 uppercase font-bold mb-1">Dettaglio Corde</p><ul class="space-y-1">`;
    Object.keys(stringCounts).sort().forEach(strId => {
        logHtml += `<li class="flex justify-between border-b border-gray-800 pb-0.5">
            <span class="text-indigo-300 font-bold">Corda ${strId}</span>
            <span class="text-gray-500">${stringCounts[strId]} ${stringCounts[strId] === 1 ? 'volta' : 'volte'}</span>
        </li>`;
    });
    logHtml += `</ul></div></div>`;
    logContainer.innerHTML = logHtml;
}

async function startMic() {
    const success = await initAudio(handlePitchUpdate);
    if (success) {
        isMicInitialized = true;
        document.getElementById('btn-start-mic').classList.add('hidden-section');
        document.getElementById('btn-stop-mic').classList.remove('hidden-section');
    } else {
        alert("Impossibile accedere al microfono.");
    }
}

function stopMic() {
    stopAudio();
    isMicInitialized = false;
    document.getElementById('btn-start-mic').classList.remove('hidden-section');
    document.getElementById('btn-stop-mic').classList.add('hidden-section');
}

// Bind to window for HTML onclick attributes
window.startMic = startMic;
window.stopMic = stopMic;
window.startSession = startSession;
window.finishSession = finishSession;

document.addEventListener('DOMContentLoaded', initStringsUI);

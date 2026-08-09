// js/modules/pat-martino.js - Pat Martino Logic

// --- TAB LOGIC ---
function switchTab(tabId, btnEl) {
    document.querySelectorAll('.pm-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.pm-tab-content').forEach(content => content.classList.remove('active'));
    
    btnEl.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}

// --- MINOR CONVERSION LOGIC ---
const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

function getIndex(note) { return notes.indexOf(note); }
function getNote(index) { return notes[(index % 12 + 12) % 12]; }

const conversions = [
    { type: '7', name: 'Dominante', shift: 7 }, // V7 -> II-7 (+7 semitoni, o una quinta giusta)
    { type: 'maj7', name: 'Maggiore', shift: 9 }, // Imaj7 -> VI-7 (+9 semitoni, o sesta maggiore)
    { type: '7alt', name: 'Alterato', shift: 1 }  // V7alt -> bVI-7 (mezzotono sopra)
];

let mcScore = 0;
let currentCorrectAns = "";

function nextMcQuestion() {
    const root = notes[Math.floor(Math.random() * notes.length)];
    const conv = conversions[Math.floor(Math.random() * conversions.length)];
    
    const targetNote = getNote(getIndex(root) + conv.shift);
    currentCorrectAns = targetNote + "m7";

    document.getElementById('mc-question').innerText = root + conv.type;
    document.getElementById('mc-feedback').innerText = "";

    // Generate options
    let options = [currentCorrectAns];
    while(options.length < 4) {
        let rNote = notes[Math.floor(Math.random() * notes.length)] + "m7";
        if(!options.includes(rNote)) options.push(rNote);
    }
    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById('mc-options');
    optionsContainer.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "pm-option-btn";
        btn.innerText = opt;
        btn.onclick = () => checkMcAnswer(opt, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkMcAnswer(selected, btnEl) {
    const feedback = document.getElementById('mc-feedback');
    const buttons = document.querySelectorAll('#mc-options button');
    buttons.forEach(b => b.disabled = true);

    if(selected === currentCorrectAns) {
        mcScore++;
        document.getElementById('mc-score').innerText = mcScore;
        feedback.innerHTML = `<span class="pm-feedback-correct">Corretto!</span>`;
        btnEl.classList.add('correct');
        setTimeout(nextMcQuestion, 1200);
    } else {
        feedback.innerHTML = `<span class="pm-feedback-wrong">Sbagliato! La risposta era ${currentCorrectAns}</span>`;
        btnEl.classList.add('wrong');
        buttons.forEach(b => {
            if(b.innerText === currentCorrectAns) {
                b.classList.add('correct');
            }
        });
        mcScore = 0;
        document.getElementById('mc-score').innerText = mcScore;
        setTimeout(nextMcQuestion, 2500);
    }
}

// --- GEOMETRY LOGIC ---
const dimChords = {
    "C": { name: "C°7", notes: ["C", "Eb", "Gb", "A"], loweringTo: ["B7", "D7", "F7", "Ab7"], lowerdNotes: ["B", "D", "F", "Ab"] },
    "C#": { name: "C#°7", notes: ["C#", "E", "G", "Bb"], loweringTo: ["C7", "Eb7", "Gb7", "A7"], lowerdNotes: ["C", "Eb", "Gb", "A"] },
    "D": { name: "D°7", notes: ["D", "F", "Ab", "B"], loweringTo: ["C#7", "E7", "G7", "Bb7"], lowerdNotes: ["C#", "E", "G", "Bb"] }
};

let currentDim = "C";
let loweredIndex = -1;

function resetDiminished() {
    currentDim = document.getElementById('dim-select').value;
    loweredIndex = -1;
    document.getElementById('dim-result').innerText = dimChords[currentDim].name;
    
    for(let i=0; i<4; i++) {
        const node = document.getElementById('node-'+i);
        node.innerText = dimChords[currentDim].notes[i];
        node.classList.remove('lowered');
    }
}

function lowerNode(index) {
    if(loweredIndex === index) {
        resetDiminished();
        return;
    }
    
    resetDiminished(); // reset colors
    loweredIndex = index;
    
    const node = document.getElementById('node-'+index);
    node.innerText = dimChords[currentDim].lowerdNotes[index];
    node.classList.add('lowered');
    
    document.getElementById('dim-result').innerText = dimChords[currentDim].loweringTo[index];
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    nextMcQuestion();
    resetDiminished();
});

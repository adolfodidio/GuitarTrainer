// js/utils/music-data.js
export const NOTES_IT = ["Do", "Do diesis", "Re", "Re diesis", "Mi", "Fa", "Fa diesis", "Sol", "Sol diesis", "La", "La diesis", "Si"];
export const NOTES_DISPLAY = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

export const STRINGS_DATA = [
    { id: 1, baseMidi: 64, name: "Mi Cantino (1)" },
    { id: 2, baseMidi: 59, name: "Si (2)" },
    { id: 3, baseMidi: 55, name: "Sol (3)" },
    { id: 4, baseMidi: 50, name: "Re (4)" },
    { id: 5, baseMidi: 45, name: "La (5)" },
    { id: 6, baseMidi: 40, name: "Mi Basso (6)" }
];

export const INTERVALS = [
    { name: "Seconda Minore", semitones: 1 },
    { name: "Seconda Maggiore", semitones: 2 },
    { name: "Terza Minore", semitones: 3 },
    { name: "Terza Maggiore", semitones: 4 },
    { name: "Quarta Giusta", semitones: 5 },
    { name: "Tritono", semitones: 6 },
    { name: "Quinta Giusta", semitones: 7 },
    { name: "Sesta Minore", semitones: 8 },
    { name: "Sesta Maggiore", semitones: 9 },
    { name: "Settima Minore", semitones: 10 },
    { name: "Settima Maggiore", semitones: 11 }
];

export function noteFromPitch(frequency) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
}

export function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

export function getNoteName(midiNum, forSpeech = false) {
    const list = forSpeech ? NOTES_IT : NOTES_DISPLAY;
    const noteName = list[midiNum % 12];
    const octave = Math.floor(midiNum / 12) - 1;

    if (forSpeech) {
        return `${noteName} ${octave}`;
    }
    return noteName + octave;
}

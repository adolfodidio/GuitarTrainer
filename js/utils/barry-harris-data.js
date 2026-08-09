// js/utils/barry-harris-data.js
const BarryHarrisData = {
    NOTES_FLAT: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
    NOTES_SHARP: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    INTERVALS: {
        major6: [0, 2, 4, 5, 7, 8, 9, 11, 12],
        minor6: [0, 2, 3, 5, 7, 8, 9, 11, 12]
    },
    MAX_FRETS: 22,
    REF_SHAPES: {
        major6: [
            { type: 'tonic', tabs: [[5,5,5,5], [8,8,9,7], [12,13,12,10], [15,17,14,14]], suffix: '6' },
            { type: 'dim',   tabs: [[7,6,7,6], [10,9,10,9], [13,12,13,12], [16,15,16,15]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[8,8,9,7], [12,13,12,10], [15,17,14,14], [17,17,17,17]], suffix: '6' },
            { type: 'dim',   tabs: [[10,9,10,9], [13,12,13,12], [16,15,16,15], [19,18,19,18]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[12,13,12,10], [15,17,14,14], [17,17,17,17], [20,20,21,19]], suffix: '6' },
            { type: 'dim',   tabs: [[13,12,13,12], [16,15,16,15], [19,18,19,18], [22,21,22,21]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[15,17,14,14], [17,17,17,17], [20,20,21,19], [24,25,24,22]], suffix: '6' },
            { type: 'dim',   tabs: [[16,15,16,15], [19,18,19,18], [22,21,22,21], [25,24,25,24]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[17,17,17,17], [20,20,21,19], [24,25,24,22], [27,29,26,26]], suffix: '6' }
        ],
        minor6: [
            { type: 'tonic', tabs: [[5,4,5,5], [8,8,8,7], [11,10,12,10], [15,13,14,13]], suffix: 'm6' },
            { type: 'dim',   tabs: [[7,6,7,6], [10,9,10,9], [13,12,13,12], [16,15,16,15]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[8,8,8,7], [11,10,12,10], [15,13,14,13], [16,17,16,15]], suffix: 'm6' },
            { type: 'dim',   tabs: [[10,9,10,9], [13,12,13,12], [16,15,16,15], [19,18,19,18]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[11,10,12,10], [15,13,14,13], [16,17,16,15], [20,20,20,19]], suffix: 'm6' },
            { type: 'dim',   tabs: [[13,12,13,12], [16,15,16,15], [19,18,19,18], [22,21,22,21]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[15,13,14,13], [16,17,16,15], [20,20,20,19], [23,22,24,22]], suffix: 'm6' },
            { type: 'dim',   tabs: [[16,15,16,15], [19,18,19,18], [22,21,22,21], [25,24,25,24]], suffix: 'dim7' },
            { type: 'tonic', tabs: [[17,16,17,17], [20,20,20,19], [23,22,24,22], [27,25,26,25]], suffix: 'm6' }
        ]
    },
    STRING_SETS: {
        top:    { name: "Top 4 (1-2-3-4)",    strings: ['string-e', 'string-b', 'string-g', 'string-d'], offsets: [0, 0, 0, 0],    midiBase: [64, 59, 55, 50] },
        middle: { name: "Middle 4 (2-3-4-5)", strings: ['string-b', 'string-g', 'string-d', 'string-a'], offsets: [5, 4, 5, 5],    midiBase: [59, 55, 50, 45] },
        bottom: { name: "Bottom 4 (3-4-5-6)", strings: ['string-g', 'string-d', 'string-a', 'string-E'], offsets: [9, 9, 10, 10],  midiBase: [55, 50, 45, 40] }
    },
    LICK_LIBRARY: {
        'parker_blues_c': {
            name: "Parker's Blues Lick",
            description: "Un classico lick blues di Charlie Parker su un C7. Le note sono G, E, G, E, Gb, F, E, Eb, C.",
            sequence: [
                { fret: 8, stringIndex: 1 }, { fret: 5, stringIndex: 1 }, { fret: 8, stringIndex: 1 }, { fret: 5, stringIndex: 1 },
                { fret: 4, stringIndex: 2 }, { fret: 3, stringIndex: 2 }, { fret: 2, stringIndex: 2 }, { fret: 1, stringIndex: 2 }, { fret: 5, stringIndex: 3 }
            ],
            bpm: 160,
            stringSet: 'top'
        },
        'parker_maj7_c': {
            name: "Parker's Major 7 Lick",
            description: "Una discesa cromatica sulla 7a maggiore, tipica di Parker. Suona bene su Cmaj7. Note: C, B, Bb, A, Ab, G.",
            sequence: [
                { fret: 8, stringIndex: 0 }, { fret: 7, stringIndex: 0 }, { fret: 6, stringIndex: 0 }, { fret: 5, stringIndex: 0 }, { fret: 9, stringIndex: 1 }, { fret: 8, stringIndex: 1 }
            ],
            bpm: 140,
            stringSet: 'top'
        }
    },
    MAJOR_SCALE_HARMONIZATION: [
        { degree: 'I', name: 'Cmaj7', quality: 'maj7', notes: 'C-E-G-B', tabs: { top: [7, 5, 5, 5], middle: [5, 4, 5, 3], bottom: [9, 9, 10, 8] }},
        { degree: 'II', name: 'Dm7', quality: 'm7', notes: 'D-F-A-C', tabs: { top: [8, 6, 7, 7], middle: [6, 5, 7, 5], bottom: [10, 10, 12, 10] }},
        { degree: 'III', name: 'Em7', quality: 'm7', notes: 'E-G-B-D', tabs: { top: [10, 8, 9, 9], middle: [8, 7, 9, 7], bottom: [12, 12, 14, 12] }},
        { degree: 'IV', name: 'Fmaj7', quality: 'maj7', notes: 'F-A-C-E', tabs: { top: [12, 10, 10, 10], middle: [10, 9, 10, 8], bottom: [14, 14, 15, 13] }},
        { degree: 'V', name: 'G7', quality: 'dom7', notes: 'G-B-D-F', tabs: { top: [13, 12, 12, 12], middle: [12, 10, 12, 10], bottom: [16, 16, 17, 15] }},
        { degree: 'VI', name: 'Am7', quality: 'm7', notes: 'A-C-E-G', tabs: { top: [15, 13, 14, 14], middle: [13, 12, 14, 12], bottom: [17, 17, 19, 17] }},
        { degree: 'VII', name: 'Bm7b5', quality: 'm7b5', notes: 'B-D-F-A', tabs: { top: [17, 15, 16, 15], middle: [15, 14, 15, 14], bottom: [19, 19, 20, 18] }},
        { degree: 'VIII', name: 'Cmaj7', quality: 'maj7', notes: 'C-E-G-B', tabs: { top: [19, 17, 17, 17], middle: [17, 16, 17, 15], bottom: [21, 21, 22, 20] }}
    ]
};

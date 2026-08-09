// js/utils/speech.js
let italianVoice = null;
export let isWaitingForSpeech = false;

function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    italianVoice = voices.find(v => v.lang === 'it-IT' && v.name.includes('Google')) ||
                   voices.find(v => v.lang === 'it-IT' && v.name.includes('Elsa') && !v.name.includes('Online')) ||
                   voices.find(v => v.lang === 'it-IT') ||
                   voices.find(v => v.lang.startsWith('it'));
}

if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

function speak(text, rate = 1.1) {
    if (!('speechSynthesis' in window)) return null;
    window.speechSynthesis.cancel();
    
    const utter = new SpeechSynthesisUtterance(text);
    if (!italianVoice) loadVoices();
    
    utter.voice = italianVoice;
    utter.lang = 'it-IT';
    utter.rate = rate;
    utter.pitch = 1.0;
    return utter;
}

export function speakFeedback(text) {
    const utter = speak(text, 1.1);
    if (utter) {
        isWaitingForSpeech = true;
        utter.onend = () => { isWaitingForSpeech = false; };
        window.speechSynthesis.speak(utter);
    }
}

export function speakAndPlay(text, frequency, playTargetNoteFn, onEndCallback) {
    if(frequency && playTargetNoteFn) playTargetNoteFn(frequency);
    
    const utter = speak(text, 1.05);
    isWaitingForSpeech = true;
    
    if (utter) {
        utter.onend = () => { 
            isWaitingForSpeech = false;
            if (onEndCallback) onEndCallback();
        };
        window.speechSynthesis.speak(utter);
    } else {
        isWaitingForSpeech = false;
        if (onEndCallback) onEndCallback();
    }
}

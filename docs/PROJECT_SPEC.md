# Architettura Tecnica
L'applicazione è sviluppata come un insieme di moduli (modello multi-pagina) e basata esclusivamente sulle tecnologie web fondamentali: **HTML5, CSS3, e JavaScript (Vanilla)**.
- **Frontend Framework:** Nessun framework esterno (no React, Vue, ecc.). Struttura a componenti web nativi o funzioni modulari per gestire il DOM.
- **Styling:** CSS3, adozione di variabili CSS per theming (es. dark mode, palette colori armonica), layout primari su CSS Grid e Flexbox.
- **Audio & Media:** API Web Audio (per intonazione, note generation) e Web Media Devices (microfono per il Fretboard Trainer).

# Contratti Dati (Data Contracts)
- **Modello Musicale (Music Model)**:
  - `Note`: { name: string, octave: number, frequency: number, accidental: 'none'|'sharp'|'flat' }
  - `Interval`: { name: string, semitones: number, quality: 'perfect'|'major'|'minor'|'diminished'|'augmented' }
  - `Chord`: { root: Note, type: string, intervals: number[], notes: Note[] }
- **Stato Moduli (State Store)**:
  - Lo stato deve essere isolato per ogni modulo in apposite classi o closure JS per evitare collisioni nello scope globale.
  - Esempio stato quiz: { currentQuestion: Object, score: number, totalQuestions: number, history: Array }

# Specifiche Funzionali
## 1. Fretboard Trainer (Trainer Tastiera)
- Analisi real-time del pitch da microfono per verificare l'esattezza della nota suonata fisicamente sulla chitarra.
- Generazione dinamica di prompt (note o intervalli).
- Monitoraggio delle performance tramite mappe di calore (Heatmaps) post-sessione.

## 2. Barry Harris Bebop Logic
- Generatore di scale bebop basato sulla regola di inserimento dei cromatismi (es. sesta diminuita).
- Visualizzazione accordi a 4 e più voci derivati dalla scala della sesta diminuita.

## 3. Trainer Intervalli & Armonia
- UI 100% Mobile-First su viewport fissa (`100dvh`).
- Quiz a risposta multipla rapida (6 opzioni).
- Rappresentazione grafica interattiva della tastiera della chitarra con *"Tap-to-Remap"* per cambiare istantaneamente la nota fondamentale (Radice) visualizzando l'intorno armonico ad alto contrasto visivo (triadi, settime, estensioni).
- Legenda armonica consultabile tramite Toggle e compendio teorico "Regola del 9".

## 4. Pat Martino Logic
- Quiz sulla conversione in minore (sostituire accordi alterati, maggiori e dominanti con i rispettivi minori settima).
- Geometria parentale: Trasformazione visiva dell'accordo diminuito abbassando i gradi di un semitono per ottenere accordi di settima di dominante.
- Visualizzazione di schemi di fraseggio lineari continui sul manico.

## 5. Vocal Intonation Trainer
- Analisi real-time del pitch da microfono e conversione della deviazione in *cents*.
- Accordatore visivo interattivo.
- Generatore di droni (pedale armonico continuo a più oscillatori) per l'ear training.
- Sfide "Call & Response" per il calcolo e l'intonazione degli intervalli musicali.

# Requisiti UX/UI
- Responsive design con predilezione per dispositivi Mobile (specialmente per uso rapido/didattico).
- Nessun tempo di caricamento percettibile. Transizioni fluide tra gli stati.
- Target Touch ottimizzati (min 44x44 px) secondo le direttive HIG (Human Interface Guidelines).

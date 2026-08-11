# Roadmap & Fasi di Sviluppo

## Fase 0: Inizializzazione Memoria & Standardizzazione 
- [x] Inizializzare struttura cartelle e memoria agente (`.agents/AGENTS.md`)
- [x] Redazione Specifiche Architetturali e di Prodotto (`docs/PROJECT_SPEC.md`)
- [x] Creazione di questa Roadmap (`docs/ROADMAP.md`)
- [x] Setup `.gitignore` e `package.json`

## Fase 1: Refactoring Modulare & CSS System (Completata)
*Obiettivo: Riorganizzare il progetto come previsto dal "Agentic Modular Engineering" isolando stili e logica in piccoli file gestibili per rispettare il Single Responsibility Principle.*
- `[x]` Creazione del Design System Globale (estrazione dei colori, typography, e CSS condiviso in un `global.css` e variabili CSS).
- `[x]` Separazione logica JS: estrarre la logica in file `.js` esterni per ogni modulo (es. `fretboard.js`, `intervalli.js`) per decongestionare i file HTML. (Parzialmente completato: `GuitarTrainer` e `TrainerIntervalli` rifattorizzati).
- `[x]` Consolidamento UI: Assicurare che tutti i moduli condividano una singola navigazione (Header o Sidebar/Menu) e presentino uno stile coeso e premium (glassmorphism, animazioni fluide).
- `[x]` Ottimizzazione Mobile: Revisionare le regole di layout mobile per garantire che tutti i moduli seguano il paradigma 100dvh e tap-target generosi.
- `[x]` Completare il refactoring di `BarryHarris.html` e `PatMartino.html`.

## Fase 1.5: Automazione & Testing (Completata)
*Obiettivo: Prevenire regressioni e validare l'integrità del DOM e della logica client-side.*
- [x] Installazione ambiente Node.js.
- [x] Setup framework End-to-End (Playwright) nel `package.json`.
- [x] Configurazione `playwright.config.js` per avviare `live-server` dinamicamente.
- [x] Creazione primo test E2E (`intervalli.spec.js`) per validare il rendering del DOM e l'interazione dei pulsanti.


## Fase 2: Potenziamento Core - Trainer Intervalli & Fretboard
- [ ] Integrazione completa API Audio (per rilevamento accurato in Fretboard Trainer).
- [ ] Miglioramento della grafica vettoriale del manico in `TrainerIntervalli.html`.
- [ ] Aggiunta modalità "Sfida a Tempo" per l'allenamento degli intervalli.
- [ ] Implementazione salvataggio statistiche base (via LocalStorage).

## Fase 3: Logiche Jazz - Barry Harris & Pat Martino
- [ ] Interazione dinamica su Barry Harris (visualizzazione spartiti generati o pentagramma canvas).
- [ ] Refactoring logica "Minor Conversion" per Pat Martino con esercizi progressivi.
- [ ] Inserimento audio di esempio (playback) dei pattern lineari di Pat Martino.

## Fase 4: Polish, Animazioni e Finalizzazione
- [ ] Micro-animazioni sui feedback (Successo/Errore).
- [ ] Tematizzazione (Toggle Light/Dark mode universale).
- [ ] PWA (Progressive Web App): Aggiunta di Service Worker per utilizzo Offline.

## Fase 5: Vocal Intonation Trainer (Completata)
- [x] Aggiornamento UI e Index per includere il nuovo modulo.
- [x] Estensione `audio-analyzer.js` con calcolo dei cents e synth drone.
- [x] Pitch Matching (Accordatore visivo in tempo reale).
- [x] Canto su Drone (Pedale armonico).
- [x] Canto dell'Intervallo (Call & Response).

---
**Criteri di Accettazione Generali per ogni Fase:**
1. Nessun file deve superare le 300 righe.
2. Interfaccia utente visivamente eccellente e responsive.
3. Assenza di bug in console e accessibilità navigabile.

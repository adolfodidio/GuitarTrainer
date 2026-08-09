# Obiettivo del Progetto
Il progetto **Guitar & Jazz Trainer** è una web app interattiva per l'apprendimento della chitarra e dell'armonia jazz, composta da moduli didattici specializzati (Fretboard Trainer, Barry Harris, Intervalli, Pat Martino).

# Direttive Permanenti per l'AI
- **Agentic Modular Engineering**: Adottare un approccio modulare e basato su agenti. Mantenere l'architettura flessibile e scalabile.
- **Aesthetics & UI/UX**: Seguire i paradigmi del design moderno (Mobile-First, interfacce touch, glassmorphism, micro-animazioni). Garantire un'esperienza visivamente premium.
- **State & Logic**: Separare la logica di business dalla UI. 

# Vincoli di Sicurezza
- Nessuna dipendenza lato server (eseguita interamente client-side).
- Non utilizzare librerie esterne non approvate per mantenere il sistema sicuro, veloce e leggero. Preferire codice Vanilla JS, CSS3, e HTML5 nativi.
- Accesso al microfono (per Fretboard Trainer) deve essere gestito solo dopo interazione dell'utente, rispettando le policy di sicurezza dei browser moderni.

# Regola di Modularità
- **Single Responsibility Principle (SRP)**: Ogni file, funzione o classe deve avere una singola responsabilità ben definita.
- **Lunghezza Massima**: Mantenere i moduli snelli e concentrati. Non superare le **200-300 righe** per file di codice. Se un file eccede questa dimensione, rifattorizzarlo estraendo logica, stili o template in moduli più piccoli.

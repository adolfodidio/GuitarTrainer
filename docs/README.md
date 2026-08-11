# Guitar Trainer 🎸

Questa web app è una suite didattica interattiva per l'apprendimento della chitarra e dell'armonia jazz, sviluppata attraverso pair programming assistito da intelligenza artificiale (Gemini / Antigravity).

## 📱 Moduli Inclusi

1. **Guitar Fretboard Trainer (`GuitarTrainer.html`)**: Riconoscimento note e intervalli sul manico con microfono / pitch detection e heatmaps di progresso.
2. **Barry Harris Bebop Logic (`BarryHarris.html`)**: Scale bebop a 6/8 note, accordi e scale di sesta diminuita.
3. **Trainer Intervalli & Armonia (`TrainerIntervalli.html`)**: 
   - Layout Mobile-First a singola schermata (`100dvh`, no scrolling).
   - Quiz rapido a 6 scelte con feedback immediato e modalità Diatonica / Cromatica.
   - Tastiera interattiva 100% touch con *Tap-to-Remap* immediato della Radice [R], capotasto fisico visibile, note in filigrana e legenda armonica a scomparsa (Toggle).
   - Compendio di teoria rapida (Regola del 9).
4. **Pat Martino Logic (`PatMartino.html`)**: Minor Conversion, geometria dell'esagramma diminuito e attività lineari.
5. **Vocal Intonation Trainer (`VocalTrainer.html`)**: Sviluppo dell'orecchio relativo e intonazione vocale. Include pitch matching in tempo reale, canto su drone (pedale) e sfide sugli intervalli, con supporto per vari registri vocali (Soprano, Tenore, Basso, ecc.).

---

## 🚀 Utilizzo
Apri `index.html` in qualsiasi browser web moderno (desktop o mobile). Non richiede alcuna installazione o backend server.

---

## 🧪 Testing (Sviluppo)
Il progetto include una suite di test End-to-End basata su **Playwright**.
Per eseguire i test (richiede Node.js):
```bash
npm install
npm run test
```

---

*This app is an interactive educational suite for guitar fretboard visualization and jazz harmony, created with AI-assisted development. Open `index.html` in any browser to get started.*

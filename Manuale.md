# Guitar & Jazz Trainer - Manuale d'Uso

Benvenuto nel **Guitar & Jazz Trainer**, una suite interattiva progettata per aiutarti a padroneggiare la tastiera della chitarra, la teoria musicale e le logiche dei più grandi maestri del jazz.

## 🚀 Come avviare il programma
Il programma è interamente basato sul web e non richiede installazioni.
Per iniziare, apri semplicemente il file `index.html` all'interno del tuo browser preferito (Chrome, Firefox, Safari, ecc.). Da lì avrai accesso alla pagina principale (Menu) per navigare tra i vari moduli.

---

## 🛠 I Moduli Disponibili

Il progetto è suddiviso in 4 moduli di allenamento indipendenti, ognuno con uno scopo specifico.

### 1. Guitar Fretboard Trainer (`GuitarTrainer.html`)
**Scopo:** Migliorare la conoscenza istantanea delle note e degli intervalli sulla tastiera.
- **Funzionamento:** Sfrutta il microfono del tuo dispositivo per rilevare le note che suoni.
- **Uso:** 
  - Scegli la scala (Diatonica o Cromatica), i tasti (da 0 a 22) e le corde su cui vuoi esercitarti.
  - L'app ti mostrerà una nota o un intervallo da trovare. Hai un limite di tempo (configurabile) per trovare la nota e suonarla fisicamente sulla tua chitarra.
  - A fine sessione, una pagina di statistiche ti mostrerà l'accuratezza, il tempo medio e una heatmap della tastiera per farti capire quali zone conosci meno.

### 2. Barry Harris Bebop Logic (`BarryHarris.html`)
**Scopo:** Esplorare l'armonia bebop, le scale e i voicing secondo l'approccio del leggendario maestro Barry Harris.
- **Funzionamento:** È un modulo teorico-pratico per comprendere le scale bebop e il movimento degli accordi.
- **Uso:** (Nota: questa sezione contiene regole e visualizzazioni per applicare scale con l'aggiunta di note di passaggio tipiche del fraseggio bebop, fondamentali per il comping e i solo).

### 3. Trainer Intervalli & Armonia (`TrainerIntervalli.html`)
**Scopo:** Allenare la mente al calcolo rapido degli intervalli musicali e visualizzare istantaneamente la loro geometria armonica sul manico della chitarra.
- **Interfaccia Mobile-First:** Progettata su viewport `100dvh` in schermata singola (zero scrolling) per un'esperienza nativa e fluida su smartphone.
- **Funzionamento & Modalità:**
  - **Quiz Intervalli:**
    - Calcola mentalmente le distanze (es. da DO a FA# o da LA a MI♭) in senso ascendente (↗) o discendente (↘).
    - Griglia ergonomica a **6 opzioni di risposta** (con target touch a standard HIG da 44-48px).
    - Modalità Diatonica o Cromatica, punteggio e percentuale di accuratezza in tempo reale, feedback stabile con spiegazione e pulsante "Prossima".
  - **Visualizzatore Tastiera 100% Touch:**
    - **Tap-to-Remap Istantaneo:** Tocca direttamente qualunque tasto su qualsiasi corda per impostarlo come nuova **Radice [R]** (in rosso brillante pulsante).
    - **Mappa Armonica Automatica:** Visualizza le relazioni armoniche vicine alla radice: Triadi maggiori e minori (🟢 3M / b3 / 5), Settime (🟣 b7 / 7M), Tensioni ed estensioni (🔵 2M / 4 / 6 / b5).
    - **Capotasto Fisico Evidenziato (Tasto 0):** Sfondo chiaro e solida barra d'avorio per identificare chiaramente le corde a vuoto, utilizzabili anch'esse come radici al tocco.
    - **Note in Filigrana:** Note fuori dal cluster armonico visibili ad alto contrasto per un rapido orientamento sul manico.
    - **Legenda Intervalli a Scomparsa (Toggle):** Pulsante dedicato per visualizzare o nascondere la legenda dettagliata a colori senza spostare la posizione della tastiera (ancorata in alto).
  - **Teoria Rapida:**
    - Compendio teorico interattivo con la "Regola del 9" per invertire gli intervalli discendenti e tabella di riferimento dei semitoni.

### 4. Pat Martino Logic (`PatMartino.html`)
**Scopo:** Studiare l'approccio unico di Pat Martino basato sulla simmetria e sulla conversione in minore.
- **Funzionamento:** Interfaccia tripartita (Minor Conversion, Geometria, Forme Lineari).
- **Uso:**
  - **Minor Conversion Trainer:** Quiz rapido in cui ti viene presentato un accordo (es. Dominante, Maggiore, Alterato) e devi scegliere su quale accordo Minore 7 devi concentrarti per l'improvvisazione.
  - **Geometria Parentale:** Uno strumento visivo interattivo. Seleziona un accordo Diminuito 7 e clicca su una delle sue note per abbassarla di un semitono, visualizzando in tempo reale come si trasforma in 4 diversi accordi di Dominante 7.
  - **Attività Lineari:** Studio dei pattern continui e del posizionamento orizzontale sul manico (es. muoversi sui set di corde superiori).

---

## 💡 Consigli per l'apprendimento
1. **Fai sessioni brevi ma frequenti:** Il *Guitar Fretboard Trainer* dà il meglio di sé se usato per 10-15 minuti al giorno prima di studiare il repertorio.
2. **Unisci la teoria alla pratica:** Quando impari un nuovo posizionamento in *Pat Martino Logic* o in *Trainer Intervalli*, tieni sempre la chitarra in mano per mappare fisicamente la zona del manico.
3. **Ascolta il feedback sonoro:** Alcuni moduli integrano la riproduzione del pitch e il riconoscimento vocale/audio. Usa le cuffie per non creare interferenze con il rilevamento del microfono.

---
*Progetto in continua evoluzione, generato e sviluppato per facilitare la padronanza totale della chitarra jazz e moderna.*

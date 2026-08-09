        const CHROMATIC_NOTES = ['DO', 'DO#', 'RE', 'RE#', 'MI', 'FA', 'FA#', 'SOL', 'SOL#', 'LA', 'LA#', 'SI'];
        const DIATONIC_NOTES = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'];

        const INTERVALS = [
            { name: 'Prima Unisono', semitones: 0, short: '1' },
            { name: '2ª Minore', semitones: 1, short: 'b2' },
            { name: '2ª Maggiore', semitones: 2, short: '2' },
            { name: '3ª Minore', semitones: 3, short: 'b3' },
            { name: '3ª Maggiore', semitones: 4, short: '3M' },
            { name: '4ª Giusta', semitones: 5, short: '4' },
            { name: 'Tritono / 5ª Dim', semitones: 6, short: 'b5' },
            { name: '5ª Giusta', semitones: 7, short: '5' },
            { name: '6ª Minore', semitones: 8, short: 'b6' },
            { name: '6ª Maggiore', semitones: 9, short: '6' },
            { name: '7ª Minore', semitones: 10, short: 'b7' },
            { name: '7ª Maggiore', semitones: 11, short: '7M' },
            { name: 'Ottava', semitones: 12, short: '8' }
        ];

        const STRING_TUNINGS = [4, 11, 7, 2, 9, 4]; // E4, B3, G3, D3, A2, E2

        let currentQuestion = {};
        let score = 0;
        let total = 0;
        let autoAdvanceTimer = null;

        // TAB SWITCHING (100% Isolated)
        function selectTab(tabId) {
            // Remove active from all buttons
            ['quiz', 'fretboard', 'theory'].forEach(id => {
                const btn = document.getElementById('btn-' + id);
                const pane = document.getElementById('pane-' + id);
                if (btn) {
                    btn.classList.remove('active');
                    btn.classList.add('text-slate-400');
                }
                if (pane) {
                    pane.classList.remove('active');
                }
            });

            // Activate chosen tab
            const activeBtn = document.getElementById('btn-' + tabId);
            const activePane = document.getElementById('pane-' + tabId);
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.classList.remove('text-slate-400');
            }
            if (activePane) {
                activePane.classList.add('active');
            }

            if (tabId === 'fretboard') {
                drawFretboard();
            }
        }

        // QUIZ SYSTEM
        function resetQuiz() {
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
            score = 0;
            total = 0;
            document.getElementById('score-val').innerText = '0';
            document.getElementById('total-val').innerText = '0';
            document.getElementById('acc-val').innerText = '100%';
            nextQuestion();
        }

        function nextQuestion() {
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

            const feedbackBox = document.getElementById('feedback-box');
            const promptIdle = document.getElementById('prompt-idle');
            
            feedbackBox.classList.add('hidden');
            feedbackBox.className = 'w-full h-full rounded-xl flex items-center justify-between px-3 border transition-all text-xs sm:text-sm font-semibold hidden';
            promptIdle.classList.remove('hidden');

            const mode = document.getElementById('scale-mode').value;
            const isDiatonic = (mode === 'diatonic');

            let note1, note2, semitones;
            const isAscending = Math.random() > 0.35;

            if (isDiatonic) {
                const idx1 = Math.floor(Math.random() * DIATONIC_NOTES.length);
                let idx2 = Math.floor(Math.random() * DIATONIC_NOTES.length);
                while (idx1 === idx2) {
                    idx2 = Math.floor(Math.random() * DIATONIC_NOTES.length);
                }

                note1 = DIATONIC_NOTES[idx1];
                note2 = DIATONIC_NOTES[idx2];

                const chromIdx1 = CHROMATIC_NOTES.indexOf(note1);
                const chromIdx2 = CHROMATIC_NOTES.indexOf(note2);

                if (isAscending) {
                    semitones = (chromIdx2 - chromIdx1 + 12) % 12;
                } else {
                    semitones = (chromIdx1 - chromIdx2 + 12) % 12;
                }
            } else {
                const rootIndex = Math.floor(Math.random() * CHROMATIC_NOTES.length);
                const intervalObj = INTERVALS[Math.floor(Math.random() * (INTERVALS.length - 1)) + 1];
                semitones = intervalObj.semitones;

                let targetIndex;
                if (isAscending) {
                    targetIndex = (rootIndex + semitones) % 12;
                } else {
                    targetIndex = (rootIndex - semitones + 12) % 12;
                }

                note1 = CHROMATIC_NOTES[rootIndex];
                note2 = CHROMATIC_NOTES[targetIndex];
            }

            const matchedInterval = INTERVALS.find(i => i.semitones === semitones) || INTERVALS[0];

            currentQuestion = {
                note1: note1,
                note2: note2,
                direction: isAscending ? 'Ascendente' : 'Discendente',
                correctAnswer: matchedInterval.name,
                semitones: semitones,
                isAscending: isAscending
            };

            // Update DOM Note Displays
            document.getElementById('note-start').innerText = note1;
            document.getElementById('note-end').innerText = note2;
            
            const dirBadge = document.getElementById('dir-badge');
            const dirIcon = document.getElementById('dir-icon');
            const dirText = document.getElementById('dir-text');

            if (isAscending) {
                dirBadge.className = 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2';
                dirIcon.innerText = '↗';
                dirText.innerText = 'Ascendente';
            } else {
                dirBadge.className = 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-2';
                dirIcon.innerText = '↘';
                dirText.innerText = 'Discendente';
            }

            // Options Selection (6 Choices)
            let options = [matchedInterval.name];
            while (options.length < 6) {
                let randomInt = INTERVALS[Math.floor(Math.random() * INTERVALS.length)].name;
                if (!options.includes(randomInt)) {
                    options.push(randomInt);
                }
            }
            options.sort(() => Math.random() - 0.5);

            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn h-11 sm:h-12 px-2 bg-slate-800/90 border border-slate-700/80 hover:border-amber-400/50 hover:bg-slate-750 text-white rounded-xl font-bold text-xs sm:text-sm text-center shadow-md active:scale-95 flex items-center justify-center';
                btn.innerText = opt;
                btn.onclick = () => answerQuestion(opt, btn);
                optionsContainer.appendChild(btn);
            });
        }

        function answerQuestion(selectedOption, clickedBtn) {
            const feedbackBox = document.getElementById('feedback-box');
            const feedbackText = document.getElementById('feedback-text');
            const promptIdle = document.getElementById('prompt-idle');
            
            total++;
            const isCorrect = selectedOption === currentQuestion.correctAnswer;

            // Highlight buttons
            document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.innerText === currentQuestion.correctAnswer) {
                    btn.classList.add('correct');
                } else if (btn === clickedBtn && !isCorrect) {
                    btn.classList.add('wrong');
                }
            });

            promptIdle.classList.add('hidden');
            feedbackBox.classList.remove('hidden');

            if (isCorrect) {
                score++;
                feedbackBox.className = 'w-full h-full rounded-xl flex items-center justify-between px-3 border transition-all text-xs sm:text-sm font-semibold bg-emerald-950/90 border-emerald-500/70 text-emerald-200 shadow-md';
                feedbackText.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="text-lg">🎉</span>
                        <div>
                            <div class="font-extrabold text-emerald-300">Esatto! (${currentQuestion.correctAnswer})</div>
                            <div class="text-[10px] text-emerald-400 font-mono">${currentQuestion.semitones} semitoni di distanza</div>
                        </div>
                    </div>
                `;
                // Auto advance after 1.5s on correct
                autoAdvanceTimer = setTimeout(() => {
                    nextQuestion();
                }, 1500);
            } else {
                feedbackBox.className = 'w-full h-full rounded-xl flex items-center justify-between px-3 border transition-all text-xs sm:text-sm font-semibold bg-rose-950/90 border-rose-500/70 text-rose-200 shadow-md';
                let exp = `<div class="font-extrabold text-rose-300">Risposta: ${currentQuestion.correctAnswer}</div>`;
                if (!currentQuestion.isAscending) {
                    const invVal = 9 - getIntervalNumber(currentQuestion.correctAnswer);
                    exp += `<div class="text-[10px] text-rose-300 font-mono font-normal">💡 Regola 9: Scendere di ${currentQuestion.correctAnswer} = Salire di ${invVal}ª</div>`;
                } else {
                    exp += `<div class="text-[10px] text-rose-300 font-mono font-normal">Distanza: ${currentQuestion.semitones} semitoni</div>`;
                }
                feedbackText.innerHTML = exp;
            }

            document.getElementById('score-val').innerText = score;
            document.getElementById('total-val').innerText = total;
            document.getElementById('acc-val').innerText = Math.round((score / total) * 100) + '%';
        }

        function getIntervalNumber(name) {
            if (name.includes('2ª')) return 2;
            if (name.includes('3ª')) return 3;
            if (name.includes('4ª')) return 4;
            if (name.includes('5ª')) return 5;
            if (name.includes('6ª')) return 6;
            if (name.includes('7ª')) return 7;
            return 0;
        }

        // FRETBOARD SYSTEM - DIRECT TAP & REMAP
        let currentRootString = 5; // Default: 6ª corda (MI Basso)
        let currentRootFret = 3;   // Default: Tasto 3 (SOL)

        const STRING_NAMES = ['1ª (MI Cant.)', '2ª (SI)', '3ª (SOL)', '4ª (RE)', '5ª (LA)', '6ª (MI Basso)'];

        const INTERVAL_MAP = {
            0: { label: 'R', type: 'root' },
            1: { label: 'b2', type: 'interval-other' },
            2: { label: '2M', type: 'interval-other' },
            3: { label: 'b3', type: 'interval-triad' },
            4: { label: '3M', type: 'interval-triad' },
            5: { label: '4',  type: 'interval-other' },
            6: { label: 'b5', type: 'interval-other' },
            7: { label: '5',  type: 'interval-triad' },
            8: { label: 'b6', type: 'interval-other' },
            9: { label: '6',  type: 'interval-other' },
            10: { label: 'b7', type: 'interval-seventh' },
            11: { label: '7M', type: 'interval-seventh' }
        };

        function selectFretAsRoot(stringIdx, fretIdx) {
            currentRootString = stringIdx;
            currentRootFret = fretIdx;
            drawFretboard();
        }

        function drawFretboard() {
            const fretboard = document.getElementById('fretboard-canvas');
            const fretNumbers = document.getElementById('fret-num-labels');
            if (!fretboard || !fretNumbers) return;

            fretboard.innerHTML = '';
            fretNumbers.innerHTML = '';

            const rootNoteIndex = (STRING_TUNINGS[currentRootString] + currentRootFret) % 12;
            const rootNoteName = CHROMATIC_NOTES[rootNoteIndex];

            // Update live info display
            const infoEl = document.getElementById('fretboard-root-info');
            if (infoEl) {
                infoEl.innerHTML = `Radice [R]: <span class="text-amber-400 font-extrabold text-xs sm:text-sm bg-slate-900 px-1.5 py-0.5 rounded border border-amber-400/40">${rootNoteName}</span> <span class="text-slate-400 text-[10px]">(${STRING_NAMES[currentRootString]} • Tasto ${currentRootFret})</span>`;
            }

            for (let f = 0; f <= 12; f++) {
                const numSpan = document.createElement('span');
                if (f === 0) {
                    numSpan.innerHTML = '<span class="px-1 py-0.5 rounded bg-slate-700/80 text-slate-200 font-extrabold border border-slate-500/50 text-[10px]">0</span>';
                    numSpan.title = 'Capotasto (Corde a vuoto)';
                } else {
                    numSpan.innerText = f;
                }
                
                if (f === currentRootFret) {
                    numSpan.style.color = '#ef4444';
                    numSpan.style.fontWeight = '900';
                } else if ([3, 5, 7, 9, 12].includes(f)) {
                    numSpan.style.color = '#f59e0b';
                    numSpan.style.fontWeight = 'bold';
                }
                fretNumbers.appendChild(numSpan);
            }

            for (let s = 0; s < 6; s++) {
                const stringEl = document.createElement('div');
                stringEl.className = 'g-string';

                for (let f = 0; f <= 12; f++) {
                    const fretEl = document.createElement('div');
                    fretEl.className = f === 0 ? 'g-fret fret-zero' : 'g-fret';
                    const noteIndex = (STRING_TUNINGS[s] + f) % 12;
                    const thisNoteName = CHROMATIC_NOTES[noteIndex];
                    const fretDesc = f === 0 ? 'Capotasto (Corda a vuoto)' : `Tasto ${f}`;
                    fretEl.title = `Tocca per impostare ${thisNoteName} (${STRING_NAMES[s]}, ${fretDesc}) come Radice [R]`;
                    fretEl.onclick = () => selectFretAsRoot(s, f);

                    const marker = document.createElement('div');

                    if (s === currentRootString && f === currentRootFret) {
                        marker.className = 'fret-marker root';
                        marker.innerText = 'R';
                    } else {
                        const semitoneDiff = (noteIndex - rootNoteIndex + 12) % 12;
                        const isCloseFret = Math.abs(f - currentRootFret) <= 3;
                        const isCloseString = Math.abs(s - currentRootString) <= 3;

                        // Se vicino alla radice, mostra la geometria degli intervalli
                        if (isCloseFret && isCloseString) {
                            const intInfo = INTERVAL_MAP[semitoneDiff];
                            if (semitoneDiff === 0) {
                                marker.className = 'fret-marker root';
                                marker.innerText = 'R';
                            } else if (intInfo) {
                                marker.className = `fret-marker ${intInfo.type}`;
                                marker.innerText = intInfo.label;
                            }
                        } else {
                            marker.className = 'fret-marker hidden-note';
                            marker.innerText = thisNoteName;
                        }
                    }

                    fretEl.appendChild(marker);
                    stringEl.appendChild(fretEl);
                }
                fretboard.appendChild(stringEl);
            }
        }

        // TOGGLE LEGEND VISIBILITY
        function toggleFretboardLegend() {
            const legendEl = document.getElementById('fretboard-legend');
            const toggleText = document.getElementById('legend-toggle-text');
            const toggleIcon = document.getElementById('legend-toggle-icon');
            if (!legendEl) return;

            const isHidden = legendEl.classList.contains('hidden');
            if (isHidden) {
                legendEl.classList.remove('hidden');
                if (toggleText) toggleText.innerText = 'Nascondi Legenda';
                if (toggleIcon) toggleIcon.innerText = '✕';
            } else {
                legendEl.classList.add('hidden');
                if (toggleText) toggleText.innerText = 'Mostra Legenda Intervalli';
                if (toggleIcon) toggleIcon.innerText = '📖';
            }
        }

        // Initialize quiz on load
        nextQuestion();
    </script>

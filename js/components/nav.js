// js/components/nav.js
// Componente Header Globale Iniettabile
export function initGlobalNav() {
    // Check if nav already exists
    if (document.getElementById('global-nav')) return;

    const navHTML = `
        <nav id="global-nav" class="global-nav">
            <a href="index.html" class="global-nav-brand">
                🎸 <span>Jazz Trainer</span>
            </a>
            <div class="global-nav-links">
                <a href="GuitarTrainer.html" class="nav-link ${location.pathname.includes('GuitarTrainer') ? 'active' : ''}" title="Fretboard">Fretboard</a>
                <a href="TrainerIntervalli.html" class="nav-link ${location.pathname.includes('TrainerIntervalli') ? 'active' : ''}" title="Intervalli">Intervalli</a>
                <a href="BarryHarris.html" class="nav-link ${location.pathname.includes('BarryHarris') ? 'active' : ''}" title="Barry Harris">B. Harris</a>
                <a href="PatMartino.html" class="nav-link ${location.pathname.includes('PatMartino') ? 'active' : ''}" title="Pat Martino">P. Martino</a>
            </div>
        </nav>
    `;

    // Wrap existing content in app-container if not already
    let appContainer = document.querySelector('.app-container');
    if (!appContainer) {
        // We assume the body is the main wrapper, we create app-container and move children
        const body = document.body;
        appContainer = document.createElement('div');
        appContainer.className = 'app-container';
        
        const contentContainer = document.createElement('div');
        contentContainer.className = 'app-content';
        
        // Move all children except script tags to contentContainer
        while (body.firstChild) {
            if (body.firstChild.tagName === 'SCRIPT' && body.firstChild.src && body.firstChild.src.includes('count.js')) {
                 body.appendChild(body.firstChild);
                 break;
            }
            contentContainer.appendChild(body.firstChild);
        }
        
        appContainer.innerHTML = navHTML;
        appContainer.appendChild(contentContainer);
        body.insertBefore(appContainer, body.firstChild);
    } else {
        appContainer.insertAdjacentHTML('afterbegin', navHTML);
    }
}

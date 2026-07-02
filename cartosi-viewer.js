(() => 
    { // Config
    const MIN_SCALE = 0.2; const MAX_SCALE = 5; const ZOOM_STEP = 1.1;
    // par cran de molette 
    const FIT_MARGIN = 20;

    // Sélectionne la zone qui contient l’image du diagramme visible
    function getActiveDiagramContainer() {
        // Les images sont dans div.diagramme-img.diagrammeDisplay (visible)
        const active = document.querySelector('.diagramme-img.diagrammeDisplay');
        if (active) return active; 
        // fallback: prendre la première visible
        const all = [...document.querySelectorAll('.diagramme-img')];
        return all.find(d => d.offsetParent !== null) || all[0] || null;
    }

    const host = getActiveDiagramContainer(); if (!host) { console.warn('[Carto PanZoom] Aucun diagramme détecté.'); return; }

    // Trouver l’[Image blocked: No description] et sa associée 
    const img = host.querySelector('img[usemap]'); if (!img) { console.warn('[Carto PanZoom] Aucune image de diagramme trouvée.'); return; }

    // Eviter que la page fasse défiler tout le document 
    // On va rendre le conteneur principal scrollable si besoin, mais Masquer les scrollbars natives ici 
    const rootScroll = document.querySelector('.diagramme-content') || host.parentElement || document.body; rootScroll.style.overflow = 'hidden';

    // Création d’un viewport et d’un calque "content" transformable 
    // On conserve l’image et sa map pour garder les zones cliquables. 
    const viewport = document.createElement('div'); viewport.style.position = 'relative'; viewport.style.width = '100%'; viewport.style.height = 'calc(100vh - 120px)';
    // hauteur raisonnable sous la barre d’outils 
    viewport.style.background = '#fff'; viewport.style.border = '1px solid #ddd'; viewport.style.overflow = 'hidden'; viewport.style.userSelect = 'none'; viewport.style.touchAction = 'none';

    const content = document.createElement('div'); content.style.position = 'absolute'; content.style.left = '0px'; content.style.top = '0px'; content.style.transformOrigin = '0 0'; content.style.willChange = 'transform';

    // Déplacer l’image dans le content 
    const mapName = img.getAttribute('usemap');
    // ex: #B17DB264... 
    const useMap = mapName && mapName.trim(); const mapEl = useMap ? document.querySelector(map[name = "${useMap.slice(1)}"]) : null;

    // On clone l’image pour éviter de casser les écouteurs éventuels 
    const imgClone = img.cloneNode(true); 
    // S’assurer que l’image n’est pas max-width:100% (sinon le scaling CSS se combine mal) 
    imgClone.style.maxWidth = 'unset'; imgClone.style.width = 'auto'; imgClone.style.height = 'auto'; imgClone.style.display = 'block';

    // Insérer 
    content.appendChild(imgClone); viewport.appendChild(content);

    // Remplacer l’ancien rendu par le viewport 
    // On garde le en place dans le DOM (il peut rester dans host)
    // Si le map est ailleurs (dans un wrapper .sensible), ça fonctionne aussi. 
    host.innerHTML = ''; host.appendChild(viewport); if (mapEl && !mapEl.isConnected) host.appendChild(mapEl);

    // Etat de la caméra 
    let scale = 1; let tx = 0; let ty = 0;

    // Dimensions intrinsèques de l’image (naturelles) 
    function getImageSize() { const w = imgClone.naturalWidth || imgClone.width; const h = imgClone.naturalHeight || imgClone.height; return { w, h }; }

    // Applique la transformation et recalcule les zones pour rester cliquables 
    function applyTransform() { content.style.transform = translate('${ tx }px, ${ ty }px) scale(${ scale }'); resizeMapAreas(); }

    // Recalcule les coords de la map à partir des coords d’origine et de la transform 
    // On enregistre les coords d’origine dans data-raw 
    function ensureRawCoords() { if (!mapEl) return; const areas = mapEl.querySelectorAll('area[coords]'); areas.forEach(a => { if (!a.dataset.rawCoords) a.dataset.rawCoords = a.getAttribute('coords') || ''; }); }

    function resizeMapAreas() {
        if (!mapEl) return; const areas = mapEl.querySelectorAll('area[coords]'); 
        areas.forEach(a => {
            const raw = a.dataset.rawCoords; if (!raw) return; const pts = raw.split(',').map(s => parseFloat(s.trim())); // Les maps ici utilisent des rect/polygon. Nous appliquons la même transform affine: x' = xscale + tx, y' = yscale + ty for (let i = 0; i < pts.length; i += 2) { pts[i] = Math.round(pts[i] * scale + tx); pts[i + 1] = Math.round(pts[i + 1] * scale + ty); } a.setAttribute('coords', pts.join(',')); }); // Important: relier l’image clonée à la map recalculée if (useMap) imgClone.setAttribute('usemap', useMap); }

            ensureRawCoords();

            // Panning (drag) 
            let dragging = false; let lastX = 0, lastY = 0;

            function onPointerDown(e) { // bouton gauche uniquement 
                if (e.button !== 0) return; dragging = true; lastX = e.clientX; lastY = e.clientY; viewport.style.cursor = 'grabbing'; e.preventDefault();
            } function onPointerMove(e) { if (!dragging) return; const dx = e.clientX - lastX; const dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; tx += dx; ty += dy; applyTransform(); } function onPointerUp() { dragging = false; viewport.style.cursor = 'default'; }

            viewport.addEventListener('mousedown', onPointerDown); window.addEventListener('mousemove', onPointerMove); window.addEventListener('mouseup', onPointerUp);

            // Zoom à la molette centré sur le pointeur 
            function zoomAt(clientX, clientY, direction) {
                const rect = viewport.getBoundingClientRect(); const x = clientX - rect.left; const y = clientY - rect.top;



                const prevScale = scale;
                const factor = direction > 0 ? (1 / ZOOM_STEP) : ZOOM_STEP;
                scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
                // Conserver le point (x,y) stable dans le contenu
                // (x - tx) / prevScale = (x - tx') / newScale  => tx' = x - (x - tx)*newScale/prevScale
                tx = x - (x - tx) * (scale / prevScale);
                ty = y - (y - ty) * (scale / prevScale);
                applyTransform();
            }

            viewport.addEventListener('wheel', (e) => { // Ctrl+molette: laissez zoomer finement; blocage du scroll page 
                e.preventDefault(); zoomAt(e.clientX, e.clientY, e.deltaY);
            }, { passive: false });

            // Double‑clic: zoom avant, Maj+double‑clic: zoom arrière 
            viewport.addEventListener('dblclick', (e) => {
                e.preventDefault(); zoomAt(e.clientX, e.clientY, e.shiftKey ? -1 : 1); // inversé pour cohérence 
            });

            // Fit to screen 
            function fitToScreen() {
                const { w, h } = getImageSize(); const rect = viewport.getBoundingClientRect(); const vw = rect.width - FIT_MARGIN * 2; const vh = rect.height - FIT_MARGIN * 2; if (w <= 0 || h <= 0 || vw <= 0 || vh <= 0) return;

                const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(vw / w, vh / h)));
                scale = s;
                // centrer
                tx = Math.round((rect.width - w * scale) / 2);
                ty = Math.round((rect.height - h * scale) / 2);
                applyTransform();
            }

            // Reset 100% 
            function resetView() { scale = 1; tx = 0; ty = 0; applyTransform(); }

            // Recalcul à chaque resize 
            window.addEventListener('resize', () => {
                // on garde le centre visuel en recalculant un fit léger si l’utilisateur n’a pas beaucoup zoomé // si scale proche du fit, on refit 
                fitToScreen();
            });

            // Raccourcis clavier: 
            0 = reset, f = fit;
            window.addEventListener('keydown', (e) => { if (e.key === '0') { resetView(); } else if (e.key.toLowerCase() === 'f') { fitToScreen(); } });

            // Style: masquer les boutons de zoom natifs si présents (optionnel) 
            const btns = document.querySelector('.button-resize'); if (btns) btns.style.opacity = '0.25';

            // Premier affichage: fit // Attendre que l’image soit chargée si besoin 
            function initOnceLoaded() { if (imgClone.complete && imgClone.naturalWidth) { fitToScreen(); } else { imgClone.addEventListener('load', fitToScreen, { once: true }); } } initOnceLoaded();

            // Observation: si l’utilisateur change d’onglet de diagramme, on réapplique à la nouvelle image 
            const observer = new MutationObserver(() => { const newHost = getActiveDiagramContainer(); if (newHost && newHost !== host) { console.info('[Carto PanZoom] Changement de diagramme détecté. Relancer le script pour ce nouvel onglet.'); } }); observer.observe(document.body, { childList: true, subtree: true });

            console.info('[Carto PanZoom] Activé. Contrôles: molette=zoom, glisser=déplacer, double‑clic=zoom avant, Maj+double‑clic=zoom arrière, f=fit, 0=reset.'); 
        }
    )();

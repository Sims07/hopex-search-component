/**
 * 🎯 SNIPER MAP - Version 31 (Stable)
 * Outil d'aide à la navigation, filtrage SVG et analyse pour Mega Hopex.
 * Charte graphique : Design System Ameli (Clair).
 * V31 : Correction du détecteur de statut (Nouveau/Modifié/Supprimé) -
 *       le rect porteur de la couleur est un FRÈRE du groupe texte, pas un enfant.
 *       Ajout d'une pastille colorée + légende dans le dashboard.
 */
(function() {
    // ---- CONFIGURATION DU DOM ET DES SÉLECTEURS ----
    const D = document;
    const Q = s => D.querySelectorAll(s);
    const E = i => D.getElementById(i);
    const NS = "http://www.w3.org/2000/svg";
    
    // Classes et Identifiants uniques pour éviter les collisions
    const W = "r-s-tg";  // Classe d'animation de la cible principale
    const A = "r-a-tg";  // Classe d'animation des pastilles de filtres
    const P = "r-pan";   // Classe du panneau de commande principal

    // 1. Nettoyage initial de toute ancienne instance présente dans la page
    Q('.' + P + ', .' + W + ', .' + A + ', [id=r-sty], [id=r-db-mdl]').forEach(e => e.remove());

    // 2. Injection des styles isolés (Charte Ameli / Assurance Maladie)
    const styleElement = D.createElement('style');
    styleElement.id = 'r-sty';
    styleElement.innerHTML = `
        .${W}, .${A} { pointer-events: none !important; }
        
        @keyframes pulseA {
            0%, 100% { stroke-width: 5; fill-opacity: .1; r: 35; }
            50% { stroke-width: 9; fill-opacity: .25; r: 50; }
        }
        @keyframes pulseW {
            0%, 100% { stroke-width: 4; r: 55; stroke-dasharray: 4 4; }
            50% { stroke-width: 6; r: 70; stroke-dasharray: 8 4; }
        }
        
        .${W} { animation: pulseW 1s infinite linear !important; stroke: #0C419A; fill: none; }
        .${A} { animation: pulseA 1.4s infinite ease-in-out !important; }
        
        .r-drg { cursor: move; user-select: none; }
        
        .${P} { 
            position: fixed; top: 80px; left: 20px; width: 340px; background: #FFFFFF; 
            color: #222324; padding: 12px; border-radius: 8px; z-index: 2147483647; 
            font-family: sans-serif; border: 2px solid #0C419A; box-sizing: border-box; 
            transition: height .2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        }
        
        .${P}.min { height: 42px !important; width: 180px !important; overflow: hidden !important; border-color: #006386 !important; }
        .${P}.min > div:not(.r-drg) { display: none !important; }
        
        .r-pn input { 
            width: 100%; padding: 8px; background: #FFFFFF; color: #0C419A; 
            border: 1px solid #545859; border-radius: 4px; font-size: 12px; 
            outline: none; font-weight: bold; box-sizing: border-box; margin-bottom: 6px; 
        }
        .r-pn button { padding: 6px; color: #FFFFFF; background: #0C419A; border-radius: 4px; font-size: 12px; cursor: pointer; box-sizing: border-box; border: none; }
        
        .r-db { 
            position: fixed; top: 0; right: 0; left: auto; width: 33vw; height: 100vh; 
            background: #FFFFFF; z-index: 2147483646; color: #222324; font-family: sans-serif; 
            padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; 
            opacity: 0; pointer-events: none; transform: translateX(100%); 
            transition: transform .25s ease, opacity .25s ease; border-left: 3px solid #0C419A; 
            box-shadow: -5px 0 15px rgba(0,0,0,0.1); 
        }
        
        .r-gr { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; flex: 1; overflow-y: auto; padding: 15px 0; align-content: start; }
        .r-cd { background: #F9F9F9; border: 1px solid #E7ECF5; border-top: 4px solid var(--c); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; box-sizing: border-box; max-height: 85vh !important; }
        
        .r-it { 
            color: #222324 !important; font-size: 11px !important; background: #FFFFFF !important; 
            padding: 6px 8px !important; border-radius: 4px !important; text-overflow: ellipsis !important; 
            white-space: nowrap !important; overflow: hidden !important; border-left: 2px solid var(--c) !important; 
            margin: 3px 0 0 0 !important; display: block !important; position: relative !important; 
            height: auto !important; min-height: 26px !important; line-height: 14px !important; 
            box-sizing: border-box !important; flex-shrink: 0 !important; border: 1px solid #E7ECF5 !important; 
        }
        
        #r-ck-g { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 6px 12px !important; width: 100 !important; box-sizing: border-box !important; }
        .r-lbl { display: flex !important; align-items: center !important; justify-content: flex-start !important; gap: 6px !important; cursor: pointer !important; margin: 0 !important; padding: 0 !important; width: auto !important; background: none !important; white-space: nowrap !important; font-weight: bold !important; height: auto !important; color: #222324 !important; }
        .r-ck { width: 14px !important; height: 14px !important; min-width: 14px !important; margin: 0 !important; padding: 0 !important; display: inline-block !important; cursor: pointer !important; position: static !important; appearance: checkbox !important; -webkit-appearance: checkbox !important; }
    `;
    D.head.appendChild(styleElement);

    // 3. Sauvegarde de l'état d'origine du zoom SVG (viewBox) pour pouvoir faire un Reset
    Q('svg').forEach(v => {
        if (v.hasAttribute('viewBox') && !v.hasAttribute('data-ro')) {
            v.setAttribute('data-ro', v.getAttribute('viewBox'));
        }
    });

    // 4. Cartographie des Filtres Technologiques
    const T = [
        { id: 'eip', n: 'EIP', k: ['eip'], c: '#006386' },
        { id: 'top', n: 'Topic', k: ['topic'], c: '#6a0dad' },
        { id: 'bdd', n: 'BDD', k: ['bdd', 'base'], c: '#D97706' },
        { id: 'api', n: 'API', k: ['api'], c: '#006386' },
        { id: 'ms', n: 'Micro Service', k: ['µs', 'micro', 'service'], c: '#B33F2E' },
        { id: 'btc', n: 'Batch', k: ['batch'], c: '#F0B323' }
    ];

    let targets = [];
    let I = 0;
    let mode = "target";
    let tOut;

    // 5. Analyseur géométrique des statuts Hopex (Nouveau, Modifié, Supprimé)
    //    NOTE V34 : l'approche "je remonte de N niveaux dans le DOM" (V32/V33) est ABANDONNÉE.
    //    Les retours terrain montrent qu'elle remonte parfois jusqu'à un conteneur partagé par
    //    des dizaines de composants (toute une rangée du diagramme), donnant la même liste de
    //    IDs Linear pour tout le monde -> inexploitable.
    //    Nouvelle approche GÉOMÉTRIQUE : on construit une seule fois la liste de TOUTES les formes
    //    du SVG portant un fill "LinearN", avec leur bounding box. Pour chaque composant, on
    //    cherche parmi ces formes celle(s) dont la bbox contient le centre du texte du composant,
    //    et on retient la PLUS PETITE (la plus "précise", pour éviter d'attraper un halo englobant
    //    plusieurs boîtes voisines). Le mapping numéro -> statut reste à valider (mode diagnostic).
    let debugMode = false; // activé/désactivé via le bouton 🐞 du panneau

    const classifyFill = (id) => {
        if (id === null || id === undefined) return null;
        // Mapping V35 - basé sur des cas confirmés sur le terrain (et non plus une hypothèse) :
        //   10 -> Nouveau   (confirmé : "ENS EIP Vaccination")
        //   6  -> Modifié   (confirmé : "ENS EIP Notification prévention" + "ENS Batch notification prévention quotidiennes")
        //   11 -> Supprimé  (confirmé : "Archivé ENS Batch notification prévention")
        //   4  -> neutre (aucun changement) -> pas de statut, valeur la plus fréquente
        //   7, 8, 9 -> inconnus pour l'instant, aucun statut affiché tant que non validés
        if (id === '10') return { c: '#22c55e', s: 'N', label: 'Nouveau' };
        if (id === '6')  return { c: '#f59e0b', s: 'M', label: 'Modifié' };
        if (id === '11') return { c: '#ef4444', s: 'S', label: 'Supprimé' };
        return null;
    };

    // Construit une seule fois (par scan) la liste de toutes les formes "LinearN" avec leur bbox.
    function buildStatusShapeCache() {
        let cache = [];
        Q('svg rect, svg path, svg polygon, svg circle, svg ellipse').forEach(sh => {
            let f = sh.getAttribute('fill') || '';
            let m = f.match(/linear(\d+)/i);
            if (!m) return;
            try {
                let b = sh.getBBox();
                if (b.width > 0 && b.height > 0) cache.push({ id: m[1], box: b, area: b.width * b.height });
            } catch (e) { /* getBBox peut échouer sur certaines formes non affichées */ }
        });
        return cache;
    }

    function buildStatusShapeStrokeCache() {
        let cache = [];
        Q('svg rect, svg path, svg polygon, svg circle, svg ellipse').forEach(sh => {
            let f = sh.getAttribute('stroke') || '';
            if (f == '') return;
            try {
                let b = sh.getBBox();
                if (b.width > 0 && b.height > 0) cache.push({ id: f, box: b, area: b.width * b.height });
            } catch (e) { /* getBBox peut échouer sur certaines formes non affichées */ }
        });
        return cache;
    }

    // Trouve, parmi le cache, la plus petite forme dont la bbox contient le centre de `bbox`.
    function findStatusEntry(cache, bbox) {
        let cx = bbox.x + bbox.width / 2, cy = bbox.y + bbox.height / 2, best = null;
        for (let i = 0; i < cache.length; i++) {
            let item = cache[i], sb = item.box;
            if (cx >= sb.x - 1 && cx <= sb.x + sb.width + 1 && cy >= sb.y - 1 && cy <= sb.y + sb.height + 1) {
                if (!best || item.area < best.area) best = item;
            }
        }
        return best; // { id, box, area } ou null
    }

    function findAllStatusEntries(cache, bbox) {
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const entries = cache
            .filter(item =>
                cx >= item.box.x - 1 &&
                cx <= item.box.x + item.box.width + 1 &&
                cy >= item.box.y - 1 &&
                cy <= item.box.y + item.box.height + 1
            )
            .sort((a, b) => a.area - b.area);

        // suppression des doublons
        const ids = [];
        const seen = new Set();

        for (const e of entries) {
            if (!seen.has(e.id)) {
                seen.add(e.id);
                ids.push(e.id);
            }
        }

        return ids;
    }

    function determineStatus(ids) {
        const key = ids.join(",");
        if (key.includes("#009300")){
            return {
                c:"#22c55e",
                s:"N",
                label:"Nouveau"
            };
        }
        if (key.includes("#a52a00")){
            return {
                c:"#f59e0b",
                s:"I",
                label:"Impacté"
            };
        }
        return  {
            c:"#8d8282",
            s:"-",
            label:"Pas de changement"
        };;
    }

    // 6. Construction HTML de l'Interface Utilisateur (Panneau principal)
    const p = D.createElement('div');
    p.className = P + ' r-pn';
    p.innerHTML = `
        <div class="r-drg" style="font-weight:bold; color:#0C419A; margin-bottom:8px; font-size:12px; display:flex; justify-content:space-between; border-bottom:1px solid #E7ECF5; padding-bottom:4px;">
            <span>🎯 SNIPER MAP V35</span>
            <div style="cursor:pointer; display:flex; gap:10px; font-family:monospace;">
                <span id="r-rst" style="color:#006386">↺ Reset</span>
                <span id="r-dbg" title="Mode diagnostic : affiche les IDs Linear bruts">🐞</span>
                <span id="r-mn">─</span>
                <span id="r-c">✕</span>
            </div>
        </div>
        <div style="margin-bottom:6px;">
            <input type="text" id="r-s" placeholder="Rechercher un composant...">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin-bottom:6px;">
                <span>Mode: <button id="r-m" style="background:#E7ECF5; color:#0C419A; padding:2px 6px; font-weight:bold;">🎯 Ciblé</button></span>
                <span id="r-ct" style="color:#0C419A; font-weight:bold;">0 / 0</span>
            </div>
            <div style="display:flex; gap:4px; margin-bottom:8px;">
                <button id="r-p" style="background:#E7ECF5; color:#222324; flex:1;">◀ Préc</button>
                <button id="r-nx" style="background:#0C419A; font-weight:bold; flex:1;">Suiv ▶</button>
            </div>
        </div>
        <div style="background:#F8F9FA; padding:8px; border-radius:4px; border:1px solid #E7ECF5; margin-bottom:6px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#545859; font-size:11px; font-weight:bold;">
                <span>⚡ FILTRES</span>
                <span style="color:#0C419A;">Actifs : <span id="r-f-cnt">0</span></span>
            </div>
            <div id="r-ck-g"></div>
        </div>
        <div id="r-db-box" style="margin-top:6px; display:none;">
            <button id="r-sh-db" style="width:100%; padding:8px; background:#E7ECF5; color:#0C419A; border:none; font-weight:bold; border-radius:4px; cursor:pointer;">📊 VOIR LE DASHBOARD</button>
        </div>
        <div id="r-pv" style="font-size:11px; background:#FFFFFF; padding:8px; border-radius:4px; border-left:3px solid #0C419A; max-height:65px; overflow-y:auto; font-family:monospace; color:#222324; display:none; margin-top:6px; border:1px solid #E7ECF5;">-</div>
    `;
    D.body.appendChild(p);

    // Injection des options de filtres
    const ckg = p.querySelector('#r-ck-g');
    T.forEach(t => {
        const l = D.createElement('label');
        l.className = 'r-lbl';
        l.style.color = '#222324';
        l.innerHTML = `<input type="checkbox" class="r-ck" value="${t.id}" style="accent-color:${t.c} !important;"> ${t.n}`;
        ckg.appendChild(l);
    });

    // 7. Construction HTML du Dashboard Latéral Réglable
    const db = D.createElement('div');
    db.className = 'r-db';
    db.id = 'r-db-mdl';
    db.innerHTML = `
        <div style="position:absolute; left:-4px; top:0; width:8px; height:100%; cursor:ew-resize; z-index:2147483647; background:transparent;" id="r-db-hdl"></div>
        <div style="display:flex; justify-content:space-between; border-bottom:2px solid #E7ECF5; padding-bottom:10px">
            <div><h2 style="margin:0; color:#0C419A; font-size:18px;">🎯 SNIPER DASHBOARD</h2></div>
            <div style="display:flex; gap:12px; font-size:11px; align-items:center; color:#545859;">
                <button id="r-db-cls" style="background:#0C419A; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold">✕ Fermer</button>
            </div>
        </div>
        <div style="display:flex; gap:16px; font-size:10px; color:#545859; padding:8px 0; border-bottom:1px solid #E7ECF5; margin-bottom:6px;">
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:5px;vertical-align:middle;"></span>Nouveau</span>
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b;margin-right:5px;vertical-align:middle;"></span>Modifié ou Supprimé</span>
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#8d8282;margin-right:5px;vertical-align:middle;"></span>Pas de changement</span>
        </div>
        <div id="r-db-grid" class="r-gr"></div>
    `;
    D.body.appendChild(db);

    // ---- GESTION DES ÉVÉNEMENTS & SOURIS (DRAG & DROP / RESIZE) ----
    let isDragging = false, oX, oY;
    p.querySelector('.r-drg').onmousedown = (e) => {
        if (['r-mn', 'r-rst', 'r-c', 'r-dbg'].includes(e.target.id)) return;
        isDragging = true;
        oX = e.clientX - p.getBoundingClientRect().left;
        oY = e.clientY - p.getBoundingClientRect().top;
    };
    D.onmousemove = (e) => {
        if (isDragging) {
            p.style.left = (e.clientX - oX) + 'px';
            p.style.top = (e.clientY - oY) + 'px';
        }
    };
    D.onmouseup = () => isDragging = false;

    let isResizing = false;
    E('r-db-hdl').onmousedown = (e) => {
        isResizing = true;
        D.body.style.userSelect = "none";
        e.preventDefault();
    };
    D.addEventListener('mousemove', (e) => {
        if (isResizing) {
            let w = window.innerWidth - e.clientX;
            if (w > 280 && w < window.innerWidth * 0.95) db.style.width = w + 'px';
        }
    });
    D.addEventListener('mouseup', () => { 
        if (isResizing) { 
            isResizing = false; 
            D.body.style.userSelect = ""; 
        } 
    });

    // Fonctions d'Ouverture/Fermeture du Dashboard
    const openDB = () => { db.style.opacity = "1"; db.style.pointerEvents = "auto"; db.style.transform = "translateX(0)"; };
    const closeDB = () => { db.style.opacity = "0"; db.style.pointerEvents = "none"; db.style.transform = "translateX(100%)"; };
    E('r-sh-db').onclick = openDB;
    E('r-db-cls').onclick = closeDB;

    const escHandler = (e) => { if (e.key === 'Escape') closeDB(); };
    D.addEventListener('keydown', escHandler);

    // Fermeture totale de l'outil (Bouton X)
    E('r-c').onclick = () => {
        Q('.' + W + ', .' + A).forEach(e => e.remove());
        D.removeEventListener('keydown', escHandler);
        db.remove();
        p.remove();
    };

    // Minimisation du panneau de contrôle
    E('r-mn').onclick = function() {
        p.classList.toggle('min');
        this.textContent = p.classList.contains('min') ? '🗖' : '─';
    };

    // Bascule du mode diagnostic (affiche les IDs Linear bruts au lieu du statut deviné)
    E('r-dbg').onclick = function() {
        debugMode = !debugMode;
        this.style.opacity = debugMode ? '1' : '0.35';
        runFilters();
    };
    E('r-dbg').style.opacity = '0.35';

    // ---- FONCTIONS CŒUR DE NAVIGATION ET FILTRAGE ----
    function resetSVGViewBoxes() {
        Q('svg').forEach(v => { 
            let o = v.getAttribute('data-ro'); 
            if (o) v.setAttribute('viewBox', o); 
        });
    }

    function createSVGCircle(cls, x, y, col) {
        let c = D.createElementNS(NS, "circle");
        c.setAttribute("class", cls); 
        c.setAttribute("cx", x); 
        c.setAttribute("cy", y);
        if (col) c.style.cssText = `stroke:${col}; fill:${col};`;
        return c;
    }

    // Mise à jour de la cible visuelle et du focus caméra
    function updateNavigationUI(idx, skipZoom) {
        let currentStatusSpan = E('r-ct'), previewDiv = E('r-pv');
        Q('.' + W).forEach(e => e.remove());
        
        if (targets.length === 0) { 
            currentStatusSpan.textContent = "0 / 0"; 
            previewDiv.textContent = "-"; 
            previewDiv.style.display = "none"; 
            return; 
        }
        
        previewDiv.style.display = "block";
        
        // Mode de vue Global (Toutes les occurrences illuminées en même temps)
        if (mode === "global") {
            let globalCoords = [];
            targets.forEach(el => {
                let g = el.closest('g');
                if (g) {
                    let b = g.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
                    if (globalCoords.some(pt => Math.hypot(pt.x - cx, pt.y - cy) < 45)) return;
                    globalCoords.push({ x: cx, y: cy }); 
                    g.appendChild(createSVGCircle(W, cx, cy));
                }
            });
            return;
        }
        
        // Mode de vue Ciblé (Navigation étape par étape avec translation de caméra)
        if (idx < 0) idx = targets.length - 1;
        if (idx >= targets.length) idx = 0;
        I = idx;
        
        let el = targets[I], g = el.closest('g'), svg = el.closest('svg');
        if (g && svg) {
            let b = g.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
            g.appendChild(createSVGCircle(W, cx, cy));
            previewDiv.textContent = g.textContent.replace(/\s+/g, ' ').trim();
            currentStatusSpan.textContent = (I + 1) + ' / ' + targets.length;
            
            if (!skipZoom) { 
                let w = 1400, h = 900; 
                svg.setAttribute('viewBox', (cx - w / 2) + ' ' + (cy - h / 2) + ' ' + w + ' ' + h); 
            }
        }
    }

    function trierPrioriteStatut(liste) {
        // 1. Définition de l'ordre des priorités (le plus petit chiffre est trié en premier)
        const priorites = {
            'N': 1,
            'I': 2
        };

        // 2. Application du tri
        return liste.sort((a, b) => {
            // On récupère le code (avec une valeur par défaut au cas où st ou st.s est absent)
            const statutA = a.st?.s;
            const statutB = b.st?.s;

            // Si le statut n'est ni N ni I, on lui attribue une priorité infinie (trié à la fin)
            const poidsA = priorites[statutA] ?? Infinity;
            const poidsB = priorites[statutB] ?? Infinity;

            // Comparaison numérique des poids
            return poidsA - poidsB;
    });
    }

    // Gestionnaire de la saisie utilisateur (Recherche textuelle)
    function searchMapText() {
        targets = [];
        let queryValue = E('r-s').value.trim().toLowerCase(), savedPoints = [];
        if (!queryValue) { updateNavigationUI(0); return; }
        
        Q('svg text, svg tspan').forEach(el => {
            let g = el.closest('g'); 
            if (!g) return;
            if (/^\s*\d{5}\s*[-–]/.test(g.textContent.trim())) return; // Ignore les cartouches de légendes numériques
            
            if (g.textContent.toLowerCase().includes(queryValue)) {
                let b = g.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
                if (savedPoints.some(pt => Math.hypot(pt.x - cx, pt.y - cy) < 45)) return; // Anti-doublon par proximité géométrique
                savedPoints.push({ x: cx, y: cy }); 
                targets.push(el);
            }
        });
        updateNavigationUI(0);
    }

    E('r-s').oninput = () => { clearTimeout(tOut); tOut = setTimeout(searchMapText, 150); };
    E('r-s').onfocus = function() { this.select(); };
    E('r-p').onclick = () => updateNavigationUI(I - 1);
    E('r-nx').onclick = () => updateNavigationUI(I + 1);
    
    E('r-m').onclick = function() {
        mode = mode === "target" ? "global" : "target";
        this.textContent = mode === "target" ? "🎯 Ciblé" : "🌐 Global";
        if (mode === "target") updateNavigationUI(I); else { resetSVGViewBoxes(); updateNavigationUI(0); }
    };

    // Bouton de réinitialisation complète (Reset)
    E('r-rst').onclick = () => {
        E('r-s').value = ""; 
        Q('.r-ck').forEach(c => c.checked = false); 
        Q('.' + W + ', .' + A).forEach(e => e.remove());
        resetSVGViewBoxes(); 
        targets = []; 
        I = 0; 
        E('r-ct').textContent = "0 / 0"; 
        E('r-f-cnt').textContent = "0";
        E('r-pv').textContent = "-"; 
        E('r-pv').style.display = "none"; 
        E('r-db-box').style.display = "none";
        closeDB(); 
        E('r-db-grid').innerHTML = "";
    };

    // Moteur d'analyse des filtres technologiques + Injection dans le Dashboard
    function runFilters() {
        Q('.' + A).forEach(e => e.remove());
        let activeFilters = Array.from(Q('.r-ck')).filter(c => c.checked).map(c => T.find(t => t.id === c.value)).filter(Boolean);
        
        if (activeFilters.length === 0) { 
            E('r-f-cnt').textContent = "0"; 
            E('r-db-box').style.display = "none"; 
            closeDB(); 
            return; 
        }
        
        let count = 0, filterCoords = [], gridData = {};
        activeFilters.forEach(a => gridData[a.id] = []);
        //const statusCache = buildStatusShapeCache(); // une seule construction pour tout le scan
        const statusCache = buildStatusShapeStrokeCache();
        Q('svg text, svg tspan').forEach(el => {
            let g = el.closest('g'); 
            if (!g) return;
            if (/^\s*\d{5}\s*[-–]/.test(g.textContent.trim())) return;
            
            let txt = g.textContent.toLowerCase();
            let match = activeFilters.find(act => act.k.some(kwd => txt.includes(kwd)));
            
            if (match) {
                let b = g.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
                if (filterCoords.some(pt => Math.hypot(pt.x - cx, pt.y - cy) < 45)) return;
                filterCoords.push({ x: cx, y: cy }); 
                count++; 
                
                g.appendChild(createSVGCircle(A, cx, cy, match.c));
                
                let cleanedText = g.textContent.replace(/\s+/g, ' ').trim();
                const ids = findAllStatusEntries(statusCache, b);

                const statusInfo = determineStatus(ids);
                if (!gridData[match.id].find(i => i.t === cleanedText)) {
                    gridData[match.id].push({ t: cleanedText, st: statusInfo, raw: ids });
                }
            }
        });
        
        E('r-f-cnt').textContent = count;
        
        // Génération HTML des listes de composants par types dans le Dashboard latéral
        if (count > 0) {
            E('r-db-box').style.display = "block"; 
            let htmlGrid = "";
            activeFilters.forEach(a => {
                let items = trierPrioriteStatut(gridData[a.id]);
                
                if (items.length > 0) {
                    htmlGrid += `
                        <div class="r-cd" style="border-top:4px solid ${a.c}">
                            <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #E7ECF5; padding-bottom:4px;">
                                <span style="color:${a.c}; font-weight:bold; font-size:12px;">■ ${a.n}</span>
                                <span style="background:${a.c}; color:white; font-weight:bold; font-size:10px; padding:1px 5px; border-radius:10px;">${items.length}</span>
                            </div>
                            <div style="display:flex; flex-direction:column; overflow-y:auto; max-height:400px !important; gap:2px !important;">
                                ${items.map(i => {
                                    console.info(i)
                                    if (debugMode) {
                                        let rawTxt = i.raw.length ? i.raw.join(',') : '∅';
                                        let badge = `<span style="display:inline-block; background:#545859; color:#fff; font-size:9px; font-family:monospace; padding:1px 5px; border-radius:4px; margin-right:6px; flex-shrink:0;">#${rawTxt}</span>`;
                                        return `<div class="r-it" style="border-left:3px solid ${a.c} !important;" title="Linear brut(s): ${rawTxt}">${badge}${i.t}</div>`;
                                    }
                                    let dot = i.st ? `<span style="display:inline-block; width:9px; height:9px; min-width:9px; border-radius:50%; background:${i.st.c}; margin-right:6px; vertical-align:middle;"></span>` : '';
                                    let tip = (i.st ? i.st.label + ' — ' : '') + i.t;
                                    return `<div class="r-it" style="border-left:3px solid ${a.c} !important;" title="${tip}">${dot}${i.t}</div>`;
                                }).join('')}
                            </div>
                        </div>`;
                }
            });
            E('r-db-grid').innerHTML = htmlGrid;
            
            if (debugMode) {
                let debugTable = [];
                activeFilters.forEach(a => gridData[a.id].forEach(i => debugTable.push({
                    Composant: i.t,
                    Categorie: a.n,
                    'Linear bruts': i.raw.join(',') || '∅',
                    'Statut devine': i.st ? i.st.label : '-'
                })));
                console.log('%c🎯 SNIPER MAP - Diagnostic Linear IDs (copie ce tableau et envoie-le)', 'color:#0C419A;font-weight:bold;');
                console.table(debugTable);
            }
        } else { 
            E('r-db-box').style.display = "none"; 
            closeDB(); 
        }
    }

    Q('.r-ck').forEach(ck => ck.onchange = runFilters);
    searchMapText(); // Premier scan à blanc au démarrage
})();

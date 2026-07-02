/**
 * 🎯 SNIPER MAP - Version 36 (Clean Code + Guard Clauses + Filtres CRUD persistés)
 * Outil d'aide à la navigation, filtrage SVG et analyse pour Mega Hopex.
 * Charte graphique : Design System Ameli (Clair).
 */
(function() {
    // ============ CONFIGURATION ET CONSTANTES ============
    
    // DOM Shortcuts
    const D = document;
    const Q = s => D.querySelectorAll(s);
    const E = i => D.getElementById(i);
    const NS = "http://www.w3.org/2000/svg";
    
    // Classes CSS
    const CSS = {
        TARGET_CIRCLE: "r-s-tg",
        FILTER_CIRCLE: "r-a-tg",
        PANEL: "r-pan",
        DRAGGABLE: "r-drg"
    };

    // Z-index
    const ZINDEX = {
        MODAL_RESIZE: 2147483647,
        DASHBOARD: 2147483646
    };

    // Dimensions Panel
    const PANEL_DIMS = {
        TOP_OFFSET: 80,
        LEFT_OFFSET: 20,
        WIDTH: 340,
        MIN_WIDTH: 180,
        MIN_HEIGHT: 42
    };

    // Dimensions Dashboard
    const DASHBOARD_DIMS = {
        WIDTH_PERCENT: 33,
        MIN_WIDTH: 280,
        MAX_WIDTH_PERCENT: 0.95,
        HANDLE_WIDTH: 8,
        HANDLE_LEFT: -4
    };

    // SVG Zoom
    const ZOOM = {
        WIDTH: 1400,
        HEIGHT: 900
    };

    // Géométrie & Proximité
    const GEOMETRY = {
        PROXIMITY_THRESHOLD: 45,
        BBOX_TOLERANCE: 1,
        DUPLICATE_CHECK_DISTANCE: 45
    };

    // Animations
    const ANIMATION = {
        PULSE_DURATION: "1s",
        PULSE_A_DURATION: "1.4s",
        SEARCH_DEBOUNCE_MS: 150,
        TRANSITION_SPEED: ".25s"
    };

    // Pulses Radii
    const PULSE_RADII = {
        A: { MIN: 35, MAX: 50 },
        W: { MIN: 55, MAX: 70 }
    };

    // Pulses Stroke Width
    const PULSE_STROKE = {
        A: { MIN: 5, MAX: 9 },
        W: { MIN: 4, MAX: 6 }
    };

    // Tailles d'éléments
    const SIZES = {
        DOT: 9,
        SMALL_DOT: 8,
        CHECKBOX: 14,
        FONT_SM: "11px",
        FONT_XS: "9px",
        BORDER_RADIUS: "4px",
        PADDING_SM: "6px 8px",
        PADDING_MD: "8px",
        BADGE_PADDING: "1px 5px"
    };

    // Couleurs Ameli
    const COLORS = {
        PRIMARY: '#0C419A',
        SECONDARY: '#006386',
        SUCCESS: '#22c55e',
        WARNING: '#f59e0b',
        DANGER: '#ef4444',
        NEUTRAL: '#8d8282',
        DARK_TEXT: '#222324',
        LIGHT_BG: '#FFFFFF',
        BORDER: '#E7ECF5',
        LIGHT_GRAY: '#F9F9FA',
        GRAY_TEXT: '#545859',
        BADGE_BG: '#545859'
    };

    // Status Linear
    const STATUS_LINEAR = {
        NEW: { id: '10', color: COLORS.SUCCESS, code: 'N', label: 'Nouveau' },
        MODIFIED: { id: '6', color: COLORS.WARNING, code: 'M', label: 'Modifié' },
        DELETED: { id: '11', color: COLORS.DANGER, code: 'S', label: 'Supprimé' },
        IMPACTED_COLOR: '#a52a00',
        NEW_COLOR: '#009300'
    };

    // Tech Filters (valeurs par défaut / valeurs de réinitialisation)
    const DEFAULT_TECH_FILTERS = [
        { id: 'eip', n: 'EIP', k: ['eip'], c: '#006386' },
        { id: 'top', n: 'Topic', k: ['topic'], c: '#6a0dad' },
        { id: 'bdd', n: 'BDD', k: ['bdd', 'base'], c: '#D97706' },
        { id: 'api', n: 'API', k: ['api'], c: '#006386' },
        { id: 'ms', n: 'Micro Service', k: ['µs', 'micro', 'service'], c: '#B33F2E' },
        { id: 'btc', n: 'Batch', k: ['batch'], c: '#F0B323' }
    ];

    // Clés de persistance localStorage
    const STORAGE_KEYS = {
        FILTERS: 'sniperMap_customFilters_v1'
    };

    // State
    const STATE = {
        targets: [],
        currentIndex: 0,
        mode: "target",
        searchTimeout: null,
        isDragging: false,
        isResizing: false,
        filters: [] // Peuplé au démarrage par loadFilters() (localStorage ou valeurs par défaut)
    };

    // ============ UTILITAIRES TEXTE/HTML ============

    function escapeHTML(str) {
        const div = D.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ============ PRÉDICATS D'INITIALISATION ============

    function hasExistingInstances() {
        return Q('.' + CSS.PANEL + ', .' + CSS.TARGET_CIRCLE + ', .' + CSS.FILTER_CIRCLE + ', [id=r-sty], [id=r-db-mdl], [id=r-fm-mdl]').length > 0;
    }

    function hasSVGViewBox(svg) {
        return svg.hasAttribute('viewBox');
    }

    function hasSavedViewBox(svg) {
        return svg.hasAttribute('data-ro');
    }

    function needsSavedViewBox(svg) {
        return hasSVGViewBox(svg) && hasSavedViewBox(svg) === false;
    }

    // ============ PRÉDICATS DE FORME ============

    function hasStrokeAttribute(element) {
        return element.hasAttribute('stroke');
    }

    function isValidStroke(stroke) {
        return stroke !== '';
    }

    function hasValidBBox(bbox) {
        return bbox.width > 0 && bbox.height > 0;
    }

    // ============ PRÉDICATS GÉOMÉTRIQUES ============

    function isPointInBBox(px, py, bbox) {
        const tolerance = GEOMETRY.BBOX_TOLERANCE;
        return px >= bbox.x - tolerance &&
               px <= bbox.x + bbox.width + tolerance &&
               py >= bbox.y - tolerance &&
               py <= bbox.y + bbox.height + tolerance;
    }

    function isDuplicateLocation(coords, cx, cy, threshold = GEOMETRY.PROXIMITY_THRESHOLD) {
        return coords.some(pt => Math.hypot(pt.x - cx, pt.y - cy) < threshold);
    }

    // ============ PRÉDICATS DE TEXTE ============

    function matchesSearchQuery(text, query) {
        return text.toLowerCase().includes(query);
    }

    function isControlButton(elementId) {
        return ['r-mn', 'r-rst', 'r-c'].includes(elementId);
    }

    function shouldAllowDragStart(elementId) {
        return isControlButton(elementId) === false;
    }

    // ============ PRÉDICATS DE STATUT ============

    function isNewStatus(ids) {
        return ids.join(",").includes(STATUS_LINEAR.NEW_COLOR);
    }

    function isImpactedStatus(ids) {
        return ids.join(",").includes(STATUS_LINEAR.IMPACTED_COLOR);
    }

    function hasStatus(item) {
        return item.st !== null && item.st !== undefined;
    }

    // ============ PRÉDICATS DE FILTRE ============

    function isFilterActive(checkbox) {
        return checkbox.checked;
    }

    function isValidFilter(filter) {
        return filter !== null && filter !== undefined;
    }

    function hasFiltersActive(filters) {
        return filters.length > 0;
    }

    function filterMatchesComponent(filter, componentText) {
        return filter.k.some(kwd => matchesSearchQuery(componentText, kwd));
    }

    function isValidFilterName(name) {
        return typeof name === 'string' && name.trim().length > 0;
    }

    function isValidStoredFilter(f) {
        return f !== null && typeof f === 'object' &&
               typeof f.id === 'string' && f.id.trim().length > 0 &&
               typeof f.n === 'string' && f.n.trim().length > 0 &&
               Array.isArray(f.k) && f.k.length > 0 &&
               typeof f.c === 'string' && f.c.trim().length > 0;
    }

    function isDuplicateFilterId(id) {
        return STATE.filters.some(f => f.id === id);
    }

    // ============ PERSISTANCE DES FILTRES (localStorage) ============

    function cloneDefaultFilters() {
        return DEFAULT_TECH_FILTERS.map(f => ({ id: f.id, n: f.n, k: [...f.k], c: f.c }));
    }

    function loadFilters() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.FILTERS);
            if (raw === null) return cloneDefaultFilters();

            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidStoredFilter)) {
                return parsed;
            }
            return cloneDefaultFilters();
        } catch (e) {
            return cloneDefaultFilters();
        }
    }

    function saveFilters() {
        try {
            localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(STATE.filters));
        } catch (e) {
            // localStorage indisponible (quota, navigation privée...) : on continue sans persister
        }
    }

    function parseKeywords(rawKeywords) {
        return rawKeywords
            .split(',')
            .map(k => k.trim().toLowerCase())
            .filter(k => k.length > 0);
    }

    function slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-+|-+$)/g, '');
    }

    function generateFilterId(name) {
        const base = 'cf-' + (slugify(name) || 'filtre');
        let id = base;
        let counter = 1;
        while (isDuplicateFilterId(id)) {
            id = base + '-' + counter;
            counter++;
        }
        return id;
    }

    // ============ CRUD FILTRES ============

    function addFilter(name, rawKeywords, color) {
        const keywords = parseKeywords(rawKeywords);
        if (isValidFilterName(name) === false || keywords.length === 0) return null;

        const filter = { id: generateFilterId(name), n: name.trim(), k: keywords, c: color || COLORS.PRIMARY };
        STATE.filters.push(filter);
        saveFilters();
        return filter;
    }

    function updateFilter(id, name, rawKeywords, color) {
        const filter = STATE.filters.find(f => f.id === id);
        if (filter === undefined) return false;

        const keywords = parseKeywords(rawKeywords);
        if (isValidFilterName(name) === false || keywords.length === 0) return false;

        filter.n = name.trim();
        filter.k = keywords;
        filter.c = color || filter.c;
        saveFilters();
        return true;
    }

    function deleteFilter(id) {
        STATE.filters = STATE.filters.filter(f => f.id !== id);
        saveFilters();
    }

    function resetFiltersToDefault() {
        STATE.filters = cloneDefaultFilters();
        saveFilters();
    }

    // ============ PRÉDICATS D'INTERFACE ============

    function hasTargets() {
        return STATE.targets.length > 0;
    }

    function hasNoTargets() {
        return STATE.targets.length === 0;
    }

    function isTargetMode() {
        return STATE.mode === "target";
    }

    function isGlobalMode() {
        return STATE.mode === "global";
    }

    function isPanelMinimized() {
        const panel = document.querySelector('.' + CSS.PANEL);
        return panel && panel.classList.contains('min');
    }

    function shouldSkipZoom(flag) {
        return flag === true;
    }

    // ============ PRÉDICATS D'ÉVÉNEMENTS ============

    function isDraggingPanel() {
        return STATE.isDragging;
    }

    function isNotDraggingPanel() {
        return STATE.isDragging === false;
    }

    function isResizingDashboard() {
        return STATE.isResizing;
    }

    function isNotResizingDashboard() {
        return STATE.isResizing === false;
    }

    function isEscapeKey(key) {
        return key === 'Escape';
    }

    function isValidResizeWidth(width, minWidth, maxWidth) {
        return width > minWidth && width < maxWidth;
    }

    // ============ PRÉDICATS DE COMPOSANT ============

    function hasValidGroup(element) {
        const group = element.closest('g');
        return group !== null;
    }

    function hasInvalidGroup(element) {
        return hasValidGroup(element) === false;
    }

    function hasValidCenter(center) {
        return center !== null;
    }

    function hasInvalidCenter(center) {
        return center === null;
    }

    function componentHasGroup(element) {
        return element.closest('g') !== null;
    }

    function componentHasNoGroup(element) {
        return element.closest('g') === null;
    }

    function componentHasParentSVG(element) {
        return element.closest('svg') !== null;
    }

    // ============ INITIALISATIONS ============

    function initializeApp() {
        if (hasExistingInstances()) {
            cleanupPreviousInstances();
        }
        STATE.filters = loadFilters();
        initializeSVGViewBoxes();
        createStyleSheet();
        createPanelUI();
        createDashboardUI();
        createFilterManagerModal();
        attachEventListeners();
        performInitialSearch();
    }

    function cleanupPreviousInstances() {
        Q('.' + CSS.PANEL + ', .' + CSS.TARGET_CIRCLE + ', .' + CSS.FILTER_CIRCLE + ', [id=r-sty], [id=r-db-mdl], [id=r-fm-mdl]')
            .forEach(e => e.remove());
    }

    function initializeSVGViewBoxes() {
        Q('svg').forEach(v => {
            if (needsSavedViewBox(v)) {
                v.setAttribute('data-ro', v.getAttribute('viewBox'));
            }
        });
    }

    // ============ FEUILLE DE STYLES ============

    function createStyleSheet() {
        const styleElement = D.createElement('style');
        styleElement.id = 'r-sty';
        styleElement.innerHTML = generateStylesCSS();
        D.head.appendChild(styleElement);
    }

    function generateStylesCSS() {
        return `
            .${CSS.TARGET_CIRCLE}, .${CSS.FILTER_CIRCLE} { pointer-events: none !important; }
            
            @keyframes pulseA {
                0%, 100% { stroke-width: ${PULSE_STROKE.A.MIN}; fill-opacity: .1; r: ${PULSE_RADII.A.MIN}; }
                50% { stroke-width: ${PULSE_STROKE.A.MAX}; fill-opacity: .25; r: ${PULSE_RADII.A.MAX}; }
            }
            @keyframes pulseW {
                0%, 100% { stroke-width: ${PULSE_STROKE.W.MIN}; r: ${PULSE_RADII.W.MIN}; stroke-dasharray: 4 4; }
                50% { stroke-width: ${PULSE_STROKE.W.MAX}; r: ${PULSE_RADII.W.MAX}; stroke-dasharray: 8 4; }
            }
            
            .${CSS.TARGET_CIRCLE} { animation: pulseW ${ANIMATION.PULSE_DURATION} infinite linear !important; stroke: ${COLORS.PRIMARY}; fill: none; }
            .${CSS.FILTER_CIRCLE} { animation: pulseA ${ANIMATION.PULSE_A_DURATION} infinite ease-in-out !important; }
            
            .${CSS.DRAGGABLE} { cursor: move; user-select: none; }
            
            .${CSS.PANEL} { 
                position: fixed; top: ${PANEL_DIMS.TOP_OFFSET}px; left: ${PANEL_DIMS.LEFT_OFFSET}px; width: ${PANEL_DIMS.WIDTH}px; background: ${COLORS.LIGHT_BG}; 
                color: ${COLORS.DARK_TEXT}; padding: 12px; border-radius: 8px; z-index: ${ZINDEX.MODAL_RESIZE}; 
                font-family: sans-serif; border: 2px solid ${COLORS.PRIMARY}; box-sizing: border-box; 
                transition: height .2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            }
            
            .${CSS.PANEL}.min { height: ${PANEL_DIMS.MIN_HEIGHT}px !important; width: ${PANEL_DIMS.MIN_WIDTH}px !important; overflow: hidden !important; border-color: ${COLORS.SECONDARY} !important; }
            .${CSS.PANEL}.min > div:not(.${CSS.DRAGGABLE}) { display: none !important; }
            
            .r-pn input { 
                width: 100%; padding: ${SIZES.PADDING_MD}; background: ${COLORS.LIGHT_BG}; color: ${COLORS.PRIMARY}; 
                border: 1px solid ${COLORS.GRAY_TEXT}; border-radius: ${SIZES.BORDER_RADIUS}; font-size: 12px; 
                outline: none; font-weight: bold; box-sizing: border-box; margin-bottom: 6px; 
            }
            .r-pn button { padding: 6px; color: ${COLORS.LIGHT_BG}; background: ${COLORS.PRIMARY}; border-radius: ${SIZES.BORDER_RADIUS}; font-size: 12px; cursor: pointer; box-sizing: border-box; border: none; }
            
            .r-db { 
                position: fixed; top: 0; right: 0; left: auto; width: ${DASHBOARD_DIMS.WIDTH_PERCENT}vw; height: 100vh; 
                background: ${COLORS.LIGHT_BG}; z-index: ${ZINDEX.DASHBOARD}; color: ${COLORS.DARK_TEXT}; font-family: sans-serif; 
                padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; 
                opacity: 0; pointer-events: none; transform: translateX(100%); 
                transition: transform ${ANIMATION.TRANSITION_SPEED} ease, opacity ${ANIMATION.TRANSITION_SPEED} ease; border-left: 3px solid ${COLORS.PRIMARY}; 
                box-shadow: -5px 0 15px rgba(0,0,0,0.1); 
            }
            
            .r-gr { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; flex: 1; overflow-y: auto; padding: 15px 0; align-content: start; }
            .r-cd { background: ${COLORS.LIGHT_GRAY}; border: 1px solid ${COLORS.BORDER}; border-top: 4px solid var(--c); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            
            .r-it { 
                color: ${COLORS.DARK_TEXT} !important; font-size: ${SIZES.FONT_SM} !important; background: ${COLORS.LIGHT_BG} !important; 
                padding: ${SIZES.PADDING_SM} !important; border-radius: ${SIZES.BORDER_RADIUS} !important; text-overflow: ellipsis !important; 
                white-space: nowrap !important; overflow: hidden !important; border-left: 2px solid var(--c) !important; 
                margin: 3px 0 0 0 !important; display: block !important; position: relative !important; 
                height: auto !important; min-height: 26px !important; line-height: 14px !important; 
                box-sizing: border-box !important; flex-shrink: 0 !important; border: 1px solid ${COLORS.BORDER} !important; 
            }
            
            #r-ck-g { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 6px 12px !important; width: 100% !important; box-sizing: border-box !important; }
            .r-lbl { display: flex !important; align-items: center !important; justify-content: flex-start !important; gap: 6px !important; cursor: pointer !important; margin: 0 !important; padding: 0 !important; user-select: none !important; }
            .r-ck { width: ${SIZES.CHECKBOX}px !important; height: ${SIZES.CHECKBOX}px !important; min-width: ${SIZES.CHECKBOX}px !important; margin: 0 !important; padding: 0 !important; display: inline-block !important; cursor: pointer !important; }

            .r-fm { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: ${ZINDEX.MODAL_RESIZE}; display: none; align-items: center; justify-content: center; font-family: sans-serif; box-sizing: border-box; }
            .r-fm-box { background: ${COLORS.LIGHT_BG}; border-radius: 8px; padding: 14px; width: 360px; max-width: 92vw; max-height: 80vh; overflow-y: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.25); box-sizing: border-box; }
            .r-fm-row { display: grid; grid-template-columns: 1fr 26px 1fr 18px; gap: 6px; align-items: center; margin-bottom: 8px; }
            .r-fm-row input[type="text"] { width: 100%; padding: 4px 6px; font-size: 11px; border: 1px solid ${COLORS.GRAY_TEXT}; border-radius: 4px; box-sizing: border-box; color: ${COLORS.DARK_TEXT}; background: ${COLORS.LIGHT_BG}; }
            .r-fm-row input[type="color"] { width: 26px; height: 24px; padding: 0; border: none; cursor: pointer; background: none; }
            .r-fm-del { cursor: pointer; text-align: center; font-size: 13px; user-select: none; }
            #r-fm-add, #r-fm-reset { font-size: 11px; padding: 6px; border-radius: ${SIZES.BORDER_RADIUS}; cursor: pointer; border: none; font-weight: bold; }
        `;
    }

    // ============ CONSTRUCTION DE L'INTERFACE ============

    function createPanelUI() {
        const panel = D.createElement('div');
        panel.className = CSS.PANEL + ' r-pn';
        panel.innerHTML = generatePanelHTML();
        D.body.appendChild(panel);
        
        renderFilterCheckboxes();
    }

    function generatePanelHTML() {
        return `
            <div class="${CSS.DRAGGABLE}" style="font-weight:bold; color:${COLORS.PRIMARY}; margin-bottom:8px; font-size:12px; display:flex; justify-content:space-between; border-bottom:1px solid ${COLORS.BORDER}; padding-bottom:8px;">
                <span>🎯 SNIPER MAP V36</span>
                <div style="cursor:pointer; display:flex; gap:10px; font-family:monospace;">
                    <span id="r-rst" style="color:${COLORS.SECONDARY}">↺ Reset</span>
                    <span id="r-mn">─</span>
                    <span id="r-c">✕</span>
                </div>
            </div>
            <div style="margin-bottom:6px;">
                <input type="text" id="r-s" placeholder="Rechercher un composant...">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin-bottom:6px;">
                    <span>Mode: <button id="r-m" style="background:${COLORS.BORDER}; color:${COLORS.PRIMARY}; padding:2px 6px; font-weight:bold;">🎯 Ciblé</button></span>
                    <span id="r-ct" style="color:${COLORS.PRIMARY}; font-weight:bold;">0 / 0</span>
                </div>
                <div style="display:flex; gap:4px; margin-bottom:8px;">
                    <button id="r-p" style="background:${COLORS.BORDER}; color:${COLORS.DARK_TEXT}; flex:1;">◀ Préc</button>
                    <button id="r-nx" style="background:${COLORS.PRIMARY}; font-weight:bold; flex:1;">Suiv ▶</button>
                </div>
            </div>
            <div style="background:${COLORS.LIGHT_GRAY}; padding:${SIZES.PADDING_MD}; border-radius:${SIZES.BORDER_RADIUS}; border:1px solid ${COLORS.BORDER}; margin-bottom:6px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; color:${COLORS.GRAY_TEXT}; font-size:11px; font-weight:bold;">
                    <span>⚡ FILTRES</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span id="r-fm-open" style="color:${COLORS.PRIMARY}; cursor:pointer;" title="Gérer les filtres">⚙️</span>
                        <span style="color:${COLORS.PRIMARY};">Actifs : <span id="r-f-cnt">0</span></span>
                    </div>
                </div>
                <div id="r-ck-g"></div>
            </div>
            <div id="r-db-box" style="margin-top:6px; display:none;">
                <button id="r-sh-db" style="width:100%; padding:${SIZES.PADDING_MD}; background:${COLORS.BORDER}; color:${COLORS.PRIMARY}; border:none; font-weight:bold; border-radius:${SIZES.BORDER_RADIUS}; cursor:pointer;">📊 Dashboard</button>
            </div>
            <div id="r-pv" style="font-size:${SIZES.FONT_SM}; background:${COLORS.LIGHT_BG}; padding:${SIZES.PADDING_MD}; border-radius:${SIZES.BORDER_RADIUS}; border-left:3px solid ${COLORS.PRIMARY}; margin-top:6px; display:none; color:${COLORS.DARK_TEXT};">-</div>
        `;
    }

    function renderFilterCheckboxes() {
        const container = E('r-ck-g');
        const previouslyChecked = new Set(
            Array.from(Q('.r-ck')).filter(isFilterActive).map(c => c.value)
        );

        container.innerHTML = '';
        STATE.filters.forEach(filter => {
            const label = D.createElement('label');
            label.className = 'r-lbl';
            label.style.color = COLORS.DARK_TEXT;
            label.innerHTML = `<input type="checkbox" class="r-ck" value="${filter.id}" style="accent-color:${filter.c} !important;"> ${escapeHTML(filter.n)}`;
            container.appendChild(label);
        });

        Q('.r-ck').forEach(c => {
            if (previouslyChecked.has(c.value)) c.checked = true;
        });

        attachFilterCheckboxListeners();
    }

    function createDashboardUI() {
        const dashboard = D.createElement('div');
        dashboard.className = 'r-db';
        dashboard.id = 'r-db-mdl';
        dashboard.innerHTML = generateDashboardHTML();
        D.body.appendChild(dashboard);
    }

    function generateDashboardHTML() {
        return `
            <div style="position:absolute; left:${DASHBOARD_DIMS.HANDLE_LEFT}px; top:0; width:${DASHBOARD_DIMS.HANDLE_WIDTH}px; height:100%; cursor:ew-resize; z-index:${ZINDEX.MODAL_RESIZE}; background:transparent;" id="r-db-hdl"></div>
            <div style="display:flex; justify-content:space-between; border-bottom:2px solid ${COLORS.BORDER}; padding-bottom:10px">
                <div><h2 style="margin:0; color:${COLORS.PRIMARY}; font-size:18px;">🎯 SNIPER DASHBOARD</h2></div>
                <div style="display:flex; gap:12px; font-size:11px; align-items:center; color:${COLORS.GRAY_TEXT};">
                    <button id="r-db-cls" style="background:${COLORS.PRIMARY}; color:white; border:none; padding:6px 12px; border-radius:${SIZES.BORDER_RADIUS}; cursor:pointer; font-weight:bold">✕ Fermer</button>
                </div>
            </div>
            ${generateDashboardLegend()}
            <div id="r-db-grid" class="r-gr"></div>
        `;
    }

    function generateDashboardLegend() {
        return `
            <div style="display:flex; gap:16px; font-size:10px; color:${COLORS.GRAY_TEXT}; padding:8px 0; border-bottom:1px solid ${COLORS.BORDER}; margin-bottom:6px;">
                <span><span style="display:inline-block;width:${SIZES.SMALL_DOT}px;height:${SIZES.SMALL_DOT}px;border-radius:50%;background:${COLORS.SUCCESS};margin-right:5px;vertical-align:middle;"></span>Nouveau</span>
                <span><span style="display:inline-block;width:${SIZES.SMALL_DOT}px;height:${SIZES.SMALL_DOT}px;border-radius:50%;background:${COLORS.WARNING};margin-right:5px;vertical-align:middle;"></span>Impacté</span>
                <span><span style="display:inline-block;width:${SIZES.SMALL_DOT}px;height:${SIZES.SMALL_DOT}px;border-radius:50%;background:${COLORS.NEUTRAL};margin-right:5px;vertical-align:middle;"></span>Sans changement</span>
            </div>
        `;
    }

    // ============ MODALE DE GESTION DES FILTRES (CRUD) ============

    function createFilterManagerModal() {
        const modal = D.createElement('div');
        modal.id = 'r-fm-mdl';
        modal.className = 'r-fm';
        modal.innerHTML = generateFilterManagerHTML();
        D.body.appendChild(modal);
    }

    function generateFilterManagerHTML() {
        return `
            <div class="r-fm-box">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid ${COLORS.BORDER}; padding-bottom:8px; margin-bottom:10px;">
                    <span style="font-weight:bold; color:${COLORS.PRIMARY}; font-size:13px;">⚙️ Gérer les filtres</span>
                    <span id="r-fm-cls" style="cursor:pointer; font-family:monospace;">✕</span>
                </div>
                <div id="r-fm-list"></div>
                <div style="display:flex; gap:6px; margin-top:4px;">
                    <button id="r-fm-add" style="flex:1; background:${COLORS.PRIMARY}; color:white;">+ Ajouter un filtre</button>
                    <button id="r-fm-reset" style="flex:1; background:${COLORS.BORDER}; color:${COLORS.DANGER};">↺ Défaut</button>
                </div>
            </div>
        `;
    }

    function renderFilterManagerList() {
        const list = E('r-fm-list');
        if (list === null) return;

        list.innerHTML = STATE.filters.map(generateFilterManagerRow).join('');
        attachFilterManagerRowListeners();
    }

    function generateFilterManagerRow(filter) {
        return `
            <div class="r-fm-row" data-id="${filter.id}">
                <input type="text" class="r-fm-name" value="${escapeHTML(filter.n)}" placeholder="Nom du filtre">
                <input type="color" class="r-fm-color" value="${filter.c}">
                <input type="text" class="r-fm-kw" value="${escapeHTML(filter.k.join(', '))}" placeholder="mots-clés, séparés, par virgule">
                <span class="r-fm-del" title="Supprimer ce filtre">🗑</span>
            </div>
        `;
    }

    function attachFilterManagerRowListeners() {
        Q('.r-fm-row').forEach(row => {
            const id = row.getAttribute('data-id');
            const nameInput = row.querySelector('.r-fm-name');
            const colorInput = row.querySelector('.r-fm-color');
            const kwInput = row.querySelector('.r-fm-kw');
            const delBtn = row.querySelector('.r-fm-del');

            const commitChanges = () => {
                const ok = updateFilter(id, nameInput.value, kwInput.value, colorInput.value);
                if (ok) {
                    renderFilterCheckboxes();
                    runFilters();
                }
            };

            nameInput.onblur = commitChanges;
            kwInput.onblur = commitChanges;
            colorInput.onchange = commitChanges;

            delBtn.onclick = () => {
                if (confirm(`Supprimer le filtre "${nameInput.value}" ?`) === false) return;
                deleteFilter(id);
                renderFilterManagerList();
                renderFilterCheckboxes();
                runFilters();
            };
        });
    }

    function attachFilterManagerListeners() {
        E('r-fm-open').onclick = openFilterManager;
        E('r-fm-cls').onclick = closeFilterManager;

        E('r-fm-add').onclick = () => {
            const filter = addFilter('Nouveau filtre', 'motclé', COLORS.PRIMARY);
            if (filter === null) return;
            renderFilterManagerList();
            renderFilterCheckboxes();
        };

        E('r-fm-reset').onclick = () => {
            if (confirm('Réinitialiser tous les filtres aux valeurs par défaut (EIP, Topic, BDD, API, Micro Service, Batch) ?') === false) return;
            resetFiltersToDefault();
            renderFilterManagerList();
            renderFilterCheckboxes();
            runFilters();
        };

        E('r-fm-mdl').addEventListener('click', (e) => {
            if (e.target.id === 'r-fm-mdl') closeFilterManager();
        });
    }

    function openFilterManager() {
        renderFilterManagerList();
        E('r-fm-mdl').style.display = 'flex';
    }

    function closeFilterManager() {
        E('r-fm-mdl').style.display = 'none';
    }

    // ============ GESTION DES ÉVÉNEMENTS ============

    function attachEventListeners() {
        attachPanelDragListeners();
        attachDashboardResizeListeners();
        attachDashboardToggleListeners();
        attachPanelControlListeners();
        attachFilterCheckboxListeners();
        attachSearchInputListener();
        attachNavigationButtonListeners();
        attachModeToggleListener();
        attachFilterManagerListeners();
    }

    function attachPanelDragListeners() {
        const panelHeader = document.querySelector('.' + CSS.PANEL + ' .' + CSS.DRAGGABLE);
        const panel = document.querySelector('.' + CSS.PANEL);
        
        panelHeader.onmousedown = (e) => {
            if (shouldAllowDragStart(e.target.id)) {
                STATE.isDragging = true;
                STATE.dragStartX = e.clientX - panel.getBoundingClientRect().left;
                STATE.dragStartY = e.clientY - panel.getBoundingClientRect().top;
            }
        };

        D.onmousemove = (e) => {
            if (isDraggingPanel()) {
                panel.style.left = (e.clientX - STATE.dragStartX) + 'px';
                panel.style.top = (e.clientY - STATE.dragStartY) + 'px';
            }
        };

        D.onmouseup = () => { STATE.isDragging = false; };
    }

    function attachDashboardResizeListeners() {
        const dashboard = E('r-db-mdl');
        const resizeHandle = E('r-db-hdl');

        resizeHandle.onmousedown = (e) => {
            STATE.isResizing = true;
            D.body.style.userSelect = "none";
            e.preventDefault();
        };

        D.addEventListener('mousemove', (e) => {
            if (isNotResizingDashboard()) return;
            
            let w = window.innerWidth - e.clientX;
            let maxWidth = window.innerWidth * DASHBOARD_DIMS.MAX_WIDTH_PERCENT;
            
            if (isValidResizeWidth(w, DASHBOARD_DIMS.MIN_WIDTH, maxWidth)) {
                dashboard.style.width = w + 'px';
            }
        });

        D.addEventListener('mouseup', () => {
            if (isNotResizingDashboard()) return;
            
            STATE.isResizing = false;
            D.body.style.userSelect = "";
        });
    }

    function attachDashboardToggleListeners() {
        E('r-sh-db').onclick = openDashboard;
        E('r-db-cls').onclick = closeDashboard;
        D.addEventListener('keydown', (e) => {
            if (isEscapeKey(e.key)) {
                closeDashboard();
            }
        });
    }

    function attachPanelControlListeners() {
        E('r-c').onclick = closeTool;
        E('r-mn').onclick = togglePanelMinimize;
        E('r-rst').onclick = resetTool;
    }

    function attachFilterCheckboxListeners() {
        Q('.r-ck').forEach(checkbox => {
            checkbox.onchange = runFilters;
        });
    }

    function attachSearchInputListener() {
        E('r-s').oninput = () => {
            clearTimeout(STATE.searchTimeout);
            STATE.searchTimeout = setTimeout(searchMapText, ANIMATION.SEARCH_DEBOUNCE_MS);
        };
        E('r-s').onfocus = function() { this.select(); };
    }

    function attachNavigationButtonListeners() {
        E('r-p').onclick = () => updateNavigationUI(STATE.currentIndex - 1);
        E('r-nx').onclick = () => updateNavigationUI(STATE.currentIndex + 1);
    }

    function attachModeToggleListener() {
        E('r-m').onclick = function() {
            STATE.mode = isTargetMode() ? "global" : "target";
            this.textContent = isTargetMode() ? "🎯 Ciblé" : "🌐 Global";
            
            if (isTargetMode()) {
                updateNavigationUI(STATE.currentIndex);
            } else {
                resetSVGViewBoxes();
                updateNavigationUI(0);
            }
        };
    }

    // ============ CONTRÔLES D'INTERFACE ============

    function openDashboard() {
        const dashboard = E('r-db-mdl');
        dashboard.style.opacity = "1";
        dashboard.style.pointerEvents = "auto";
        dashboard.style.transform = "translateX(0)";
    }

    function closeDashboard() {
        const dashboard = E('r-db-mdl');
        dashboard.style.opacity = "0";
        dashboard.style.pointerEvents = "none";
        dashboard.style.transform = "translateX(100%)";
    }

    function closeTool() {
        Q('.' + CSS.TARGET_CIRCLE + ', .' + CSS.FILTER_CIRCLE).forEach(e => e.remove());
        D.removeEventListener('keydown', (e) => { if (isEscapeKey(e.key)) closeDashboard(); });
        E('r-db-mdl').remove();
        E('r-fm-mdl').remove();
        document.querySelector('.' + CSS.PANEL).remove();
    }

    function togglePanelMinimize() {
        const panel = document.querySelector('.' + CSS.PANEL);
        panel.classList.toggle('min');
        this.textContent = isPanelMinimized() ? '🗖' : '─';
    }

    function resetTool() {
        E('r-s').value = "";
        Q('.r-ck').forEach(c => c.checked = false);
        Q('.' + CSS.TARGET_CIRCLE + ', .' + CSS.FILTER_CIRCLE).forEach(e => e.remove());
        resetSVGViewBoxes();
        STATE.targets = [];
        STATE.currentIndex = 0;
        E('r-ct').textContent = "0 / 0";
        E('r-f-cnt').textContent = "0";
        E('r-pv').textContent = "-";
        E('r-pv').style.display = "none";
        E('r-db-box').style.display = "none";
        closeDashboard();
        E('r-db-grid').innerHTML = "";
    }

    // ============ ANALYSE DE STATUT ============

    function buildStatusShapeStrokeCache() {
        let cache = [];
        Q('svg rect, svg path, svg polygon, svg circle, svg ellipse').forEach(sh => {
            if (hasStrokeAttribute(sh) === false) return;
            
            let stroke = sh.getAttribute('stroke');
            if (isValidStroke(stroke) === false) return;
            
            try {
                let bbox = sh.getBBox();
                if (hasValidBBox(bbox) === false) return;
                
                cache.push({ id: stroke, box: bbox, area: bbox.width * bbox.height });
            } catch (e) { /* getBBox peut échouer */ }
        });
        return cache;
    }

    function findAllStatusEntries(cache, bbox) {
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        const entries = cache
            .filter(item => isPointInBBox(cx, cy, item.box))
            .sort((a, b) => a.area - b.area);

        return deduplicateEntries(entries);
    }

    function deduplicateEntries(entries) {
        const ids = [];
        const seen = new Set();
        for (const e of entries) {
            if (seen.has(e.id) === false) {
                seen.add(e.id);
                ids.push(e.id);
            }
        }
        return ids;
    }

    function determineStatus(ids) {
        if (isNewStatus(ids)) {
            return {
                c: STATUS_LINEAR.NEW.color,
                s: STATUS_LINEAR.NEW.code,
                label: STATUS_LINEAR.NEW.label
            };
        }
        
        if (isImpactedStatus(ids)) {
            return {
                c: COLORS.WARNING,
                s: 'I',
                label: 'Impacté'
            };
        }
        
        return {
            c: COLORS.NEUTRAL,
            s: "-",
            label: "Pas de changement"
        };
    }

    // ============ UTILITAIRES SVG ============

    function resetSVGViewBoxes() {
        Q('svg').forEach(v => {
            let original = v.getAttribute('data-ro');
            if (original) v.setAttribute('viewBox', original);
        });
    }

    function createSVGCircle(className, cx, cy, color) {
        let circle = D.createElementNS(NS, "circle");
        circle.setAttribute("class", className);
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        if (color) {
            circle.style.cssText = `stroke:${color}; fill:${color};`;
        }
        return circle;
    }

    function getComponentCenter(element) {
        if (hasInvalidGroup(element)) return null;
        
        const group = element.closest('g');
        const bbox = group.getBBox();
        return {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
            bbox: bbox,
            text: group.textContent.replace(/\s+/g, ' ').trim()
        };
    }

    // ============ NAVIGATION ============

    function updateNavigationUI(idx, skipZoom = false) {
        const statusSpan = E('r-ct');
        const previewDiv = E('r-pv');
        
        removeAllTargetCircles();

        if (hasNoTargets()) {
            displayEmptyState(statusSpan, previewDiv);
            return;
        }

        previewDiv.style.display = "block";

        if (isGlobalMode()) {
            displayGlobalMode();
            return;
        }

        displayTargetMode(idx, statusSpan, previewDiv, skipZoom);
    }

    function removeAllTargetCircles() {
        Q('.' + CSS.TARGET_CIRCLE).forEach(e => e.remove());
    }

    function displayEmptyState(statusSpan, previewDiv) {
        statusSpan.textContent = "0 / 0";
        previewDiv.textContent = "-";
        previewDiv.style.display = "none";
    }

    function displayGlobalMode() {
        let globalCoords = [];
        STATE.targets.forEach(el => {
            const center = getComponentCenter(el);
            if (hasInvalidCenter(center)) return;

            if (isDuplicateLocation(globalCoords, center.x, center.y)) return;

            globalCoords.push({ x: center.x, y: center.y });
            const group = el.closest('g');
            group.appendChild(createSVGCircle(CSS.TARGET_CIRCLE, center.x, center.y));
        });
    }

    function displayTargetMode(idx, statusSpan, previewDiv, skipZoom) {
        if (idx < 0) idx = STATE.targets.length - 1;
        if (idx >= STATE.targets.length) idx = 0;
        STATE.currentIndex = idx;

        const el = STATE.targets[STATE.currentIndex];
        const center = getComponentCenter(el);
        
        if (hasInvalidCenter(center)) return;

        const group = el.closest('g');
        const svg = el.closest('svg');
        
        group.appendChild(createSVGCircle(CSS.TARGET_CIRCLE, center.x, center.y));
        previewDiv.textContent = center.text;
        statusSpan.textContent = (STATE.currentIndex + 1) + ' / ' + STATE.targets.length;

        if (shouldSkipZoom(skipZoom) === false && svg) {
            zoomToTarget(svg, center.x, center.y);
        }
    }

    function zoomToTarget(svg, cx, cy) {
        const viewBox = `${cx - ZOOM.WIDTH / 2} ${cy - ZOOM.HEIGHT / 2} ${ZOOM.WIDTH} ${ZOOM.HEIGHT}`;
        svg.setAttribute('viewBox', viewBox);
    }

    // ============ RECHERCHE ET FILTRAGE ============

    function searchMapText() {
        STATE.targets = [];
        const query = E('r-s').value.trim().toLowerCase();
        
        if (query) {
            performSearch(query);
        }
        
        updateNavigationUI(0);
    }

    function performSearch(query) {
        const savedPoints = [];
        
        Q('svg text, svg tspan').forEach(el => {
            const group = el.closest('g');
            if (componentHasNoGroup(el)) return;

            if (matchesSearchQuery(group.textContent, query)) {
                const center = getComponentCenter(el);
                if (hasInvalidCenter(center)) return;

                if (isDuplicateLocation(savedPoints, center.x, center.y)) return;

                savedPoints.push({ x: center.x, y: center.y });
                STATE.targets.push(el);
            }
        });
    }

    function sortByStatusPriority(items) {
        const priorities = { 'N': 1, 'I': 2 };

        return items.sort((a, b) => {
            const statusA = a.st?.s;
            const statusB = b.st?.s;
            const weightA = priorities[statusA] ?? Infinity;
            const weightB = priorities[statusB] ?? Infinity;
            return weightA - weightB;
        });
    }

    function runFilters() {
        Q('.' + CSS.FILTER_CIRCLE).forEach(e => e.remove());

        const activeFilters = getActiveFilters();

        if (hasFiltersActive(activeFilters) === false) {
            handleNoActiveFilters();
            return;
        }

        const gridData = processFilteredComponents(activeFilters);
        const totalCount = Object.values(gridData).reduce((sum, arr) => sum + arr.length, 0);

        updateFilterUI(totalCount, activeFilters, gridData);
    }

    function getActiveFilters() {
        return Array.from(Q('.r-ck'))
            .filter(isFilterActive)
            .map(c => STATE.filters.find(t => t.id === c.value))
            .filter(isValidFilter);
    }

    function handleNoActiveFilters() {
        E('r-f-cnt').textContent = "0";
        E('r-db-box').style.display = "none";
        closeDashboard();
    }

    function processFilteredComponents(activeFilters) {
        const gridData = {};
        const filterCoords = [];
        const statusCache = buildStatusShapeStrokeCache();

        activeFilters.forEach(a => gridData[a.id] = []);

        Q('svg text, svg tspan').forEach(el => {
            const group = el.closest('g');
            if (componentHasNoGroup(el)) return;

            const match = findMatchingFilter(group, activeFilters);
            if (match === undefined) return;

            const center = getComponentCenter(el);
            if (hasInvalidCenter(center)) return;

            if (isDuplicateLocation(filterCoords, center.x, center.y)) return;

            filterCoords.push({ x: center.x, y: center.y });
            group.appendChild(createSVGCircle(CSS.FILTER_CIRCLE, center.x, center.y, match.c));

            const ids = findAllStatusEntries(statusCache, center.bbox);
            const statusInfo = determineStatus(ids);

            if (gridData[match.id].find(i => i.t === center.text) === undefined) {
                gridData[match.id].push({ t: center.text, st: statusInfo, raw: ids });
            }
        });

        return gridData;
    }

    function findMatchingFilter(group, activeFilters) {
        const txt = group.textContent.toLowerCase();
        return activeFilters.find(act => filterMatchesComponent(act, txt));
    }

    function updateFilterUI(totalCount, activeFilters, gridData) {
        E('r-f-cnt').textContent = totalCount;

        if (totalCount === 0) {
            E('r-db-box').style.display = "none";
            closeDashboard();
            return;
        }

        E('r-db-box').style.display = "block";
        const htmlGrid = generateDashboardGrid(activeFilters, gridData);
        E('r-db-grid').innerHTML = htmlGrid;
    }

    function generateDashboardGrid(activeFilters, gridData) {
        let html = "";

        activeFilters.forEach(filter => {
            const items = sortByStatusPriority(gridData[filter.id]);

            if (items.length > 0) {
                html += generateFilterCard(filter, items);
            }
        });

        return html;
    }

    function generateFilterCard(filter, items) {
        return `
            <div class="r-cd" style="border-top:4px solid ${filter.c}">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid ${COLORS.BORDER}; padding-bottom:4px;">
                    <span style="color:${filter.c}; font-weight:bold; font-size:12px;">■ ${escapeHTML(filter.n)}</span>
                    <span style="background:${filter.c}; color:white; font-weight:bold; font-size:10px; padding:${SIZES.BADGE_PADDING}; border-radius:10px;">${items.length}</span>
                </div>
                <div style="display:flex; flex-direction:column; overflow-y:auto; max-height:400px !important; gap:2px !important;">
                    ${generateItemsList(items, filter.c)}
                </div>
            </div>`;
    }

    function generateItemsList(items, filterColor) {
        return items.map(item => generateNormalItem(item, filterColor)).join('');
    }

    function generateNormalItem(item, filterColor) {
        const dot = hasStatus(item) ? `<span style="display:inline-block; width:${SIZES.DOT}px; height:${SIZES.DOT}px; min-width:${SIZES.DOT}px; border-radius:50%; background:${item.st.c}; margin-right:6px;"></span>` : '';
        const title = (hasStatus(item) ? item.st.label + ' — ' : '') + item.t;
        return `<div class="r-it" style="border-left:3px solid ${filterColor} !important;" title="${title}">${dot}${item.t}</div>`;
    }

    function performInitialSearch() {
        searchMapText();
    }

    // ============ LANCEMENT DE L'APPLICATION ============
    initializeApp();
})();

# Sniper Map (Mega Hopex)

**Outil d'aide à la navigation, filtrage SVG et analyse pour Mega Hopex.**

---

## 📌 À propos

**Sniper Map** est un bookmarklet conçu pour améliorer l'expérience utilisateur dans **Mega Hopex** en offrant :
- Une **recherche rapide** dans les éléments SVG.
- Un **filtrage par technologie** (EIP, Topic, BDD, API, Micro Service, Batch).
- Une **visualisation ciblée** ou globale des résultats.
- Un **dashboard latéral** pour analyser les résultats filtrés.
- Une **intégration discrète** via un panneau flottant.

---

## 🚀 Installation

### Méthode 1 : Glisser-déposer (recommandé)
1. Ouvrez **Mega Hopex** dans votre navigateur.
2. Ouvrez la console du navigateur (**F12** ou **Ctrl+Shift+I**).
3. Copiez-collez le code suivant dans la console et exécutez-le :

   ```javascript
   (function() {
    // Create a temporary button
    const btn = document.createElement('a');
    btn.href = "javascript:" + (function() {
        (function(){const D=document;const Q=s=>D.querySelectorAll(s);const E=i=>D.getElementById(i);const NS="http:const W="r-s-tg";const A="r-a-tg";const P="r-pan";Q('.'+P+',.'+W+',.'+A+',[id=r-sty],[id=r-db-mdl]').forEach(e=>e.remove());const styleElement=D.createElement('style');styleElement.id='r-sty';styleElement.innerHTML=` .${W},.${A}{pointer-events:none!important;}@keyframes pulseA{0%,100%{stroke-width:5;fill-opacity:.1;r:35;}50%{stroke-width:9;fill-opacity:.25;r:50;}}@keyframes pulseW{0%,100%{stroke-width:4;r:55;stroke-dasharray:4 4;}50%{stroke-width:6;r:70;stroke-dasharray:8 4;}}.${W}{animation:pulseW 1s infinite linear!important;stroke:#0C419A;fill:none;}.${A}{animation:pulseA 1.4s infinite ease-in-out!important;}.r-drg{cursor:move;user-select:none;}.${P}{position:fixed;top:80px;left:20px;width:340px;background:#FFFFFF;color:#222324;padding:12px;border-radius:8px;z-index:2147483647;font-family:sans-serif;border:2px solid #0C419A;box-sizing:border-box;transition:height .2s;box-shadow:0 4px 6px rgba(0,0,0,0.1);}.${P}.min{height:42px!important;width:180px!important;overflow:hidden!important;border-color:#006386!important;}.${P}.min>div:not(.r-drg){display:none!important;}.r-pn input{width:100%;padding:8px;background:#FFFFFF;color:#0C419A;border:1px solid #545859;border-radius:4px;font-size:12px;outline:none;font-weight:bold;box-sizing:border-box;margin-bottom:6px;}.r-pn button{padding:6px;color:#FFFFFF;background:#0C419A;border-radius:4px;font-size:12px;cursor:pointer;box-sizing:border-box;border:none;}.r-db{position:fixed;top:0;right:0;left:auto;width:33vw;height:100vh;background:#FFFFFF;z-index:2147483646;color:#222324;font-family:sans-serif;padding:25px;box-sizing:border-box;display:flex;flex-direction:column;opacity:0;pointer-events:none;transform:translateX(100%);transition:transform .25s ease,opacity .25s ease;border-left:3px solid #0C419A;box-shadow:-5px 0 15px rgba(0,0,0,0.1);}.r-gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:15px;flex:1;overflow-y:auto;padding:15px 0;align-content:start;}.r-cd{background:#F9F9F9;border:1px solid #E7ECF5;border-top:4px solid var(--c);border-radius:8px;padding:12px;display:flex;flex-direction:column;box-sizing:border-box;max-height:85vh!important;}.r-it{color:#222324!important;font-size:11px!important;background:#FFFFFF!important;padding:6px 8px!important;border-radius:4px!important;text-overflow:ellipsis!important;white-space:nowrap!important;overflow:hidden!important;border-left:2px solid var(--c)!important;margin:3px 0 0 0!important;display:block!important;position:relative!important;height:auto!important;min-height:26px!important;line-height:14px!important;box-sizing:border-box!important;flex-shrink:0!important;border:1px solid #E7ECF5!important;}#r-ck-g{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px 12px!important;width:100!important;box-sizing:border-box!important;}.r-lbl{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;cursor:pointer!important;margin:0!important;padding:0!important;width:auto!important;background:none!important;white-space:nowrap!important;font-weight:bold!important;height:auto!important;color:#222324!important;}.r-ck{width:14px!important;height:14px!important;min-width:14px!important;margin:0!important;padding:0!important;display:inline-block!important;cursor:pointer!important;position:static!important;appearance:checkbox!important;-webkit-appearance:checkbox!important;}`;D.head.appendChild(styleElement);Q('svg').forEach(v=>{if(v.hasAttribute('viewBox')&&!v.hasAttribute('data-ro')){v.setAttribute('data-ro',v.getAttribute('viewBox'));}});const T=[{id:'eip',n:'EIP',k:['eip'],c:'#006386'},{id:'top',n:'Topic',k:['topic'],c:'#6a0dad'},{id:'bdd',n:'BDD',k:['bdd','base'],c:'#D97706'},{id:'api',n:'API',k:['api'],c:'#006386'},{id:'ms',n:'Micro Service',k:['µs','micro','service'],c:'#B33F2E'},{id:'btc',n:'Batch',k:['batch'],c:'#F0B323'}];let targets=[];let I=0;let mode="target";let tOut;const getStat=(g)=>{let sh=g.querySelector('rect,path,polygon,circle');if(!sh)return null;let f=sh.getAttribute('fill')||'';if(/linear(10|11)/i.test(f))return{c:'#22c55e',s:'N'};if(/linear(8|9)/i.test(f))return{c:'#f59e0b',s:'M'};if(/linear(6|7)/i.test(f))return{c:'#ef4444',s:'S'};return null;};const p=D.createElement('div');p.className=P+' r-pn';p.innerHTML=`<div class="r-drg" style="font-weight:bold;color:#0C419A;margin-bottom:8px;font-size:12px;display:flex;justify-content:space-between;border-bottom:1px solid #E7ECF5;padding-bottom:4px;"><span>🎯 SNIPER MAP V30</span><div style="cursor:pointer;display:flex;gap:10px;font-family:monospace;"><span id="r-rst" style="color:#006386">↺ Reset</span><span id="r-mn">─</span><span id="r-c">✕</span></div></div><div style="margin-bottom:6px;"><input type="text" id="r-s" placeholder="Rechercher un composant..."><div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:6px;"><span>Mode:<button id="r-m" style="background:#E7ECF5;color:#0C419A;padding:2px 6px;font-weight:bold;">🎯 Ciblé</button></span><span id="r-ct" style="color:#0C419A;font-weight:bold;">0/0</span></div><div style="display:flex;gap:4px;margin-bottom:8px;"><button id="r-p" style="background:#E7ECF5;color:#222324;flex:1;">◀ Préc</button><button id="r-nx" style="background:#0C419A;font-weight:bold;flex:1;">Suiv ▶</button></div></div><div style="background:#F8F9FA;padding:8px;border-radius:4px;border:1px solid #E7ECF5;margin-bottom:6px;"><div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#545859;font-size:11px;font-weight:bold;"><span>⚡ FILTRES</span><span style="color:#0C419A;">Actifs:<span id="r-f-cnt">0</span></span></div><div id="r-ck-g"></div></div><div id="r-db-box" style="margin-top:6px;display:none;"><button id="r-sh-db" style="width:100%;padding:8px;background:#E7ECF5;color:#0C419A;border:none;font-weight:bold;border-radius:4px;cursor:pointer;">📊 VOIR LE DASHBOARD</button></div><div id="r-pv" style="font-size:11px;background:#FFFFFF;padding:8px;border-radius:4px;border-left:3px solid #0C419A;max-height:65px;overflow-y:auto;font-family:monospace;color:#222324;display:none;margin-top:6px;border:1px solid #E7ECF5;">-</div>`;D.body.appendChild(p);const ckg=p.querySelector('#r-ck-g');T.forEach(t=>{const l=D.createElement('label');l.className='r-lbl';l.style.color='#222324';l.innerHTML=`<input type="checkbox" class="r-ck" value="${t.id}" style="accent-color:${t.c}!important;">${t.n}`;ckg.appendChild(l);});const db=D.createElement('div');db.className='r-db';db.id='r-db-mdl';db.innerHTML=`<div style="position:absolute;left:-4px;top:0;width:8px;height:100%;cursor:ew-resize;z-index:2147483647;background:transparent;" id="r-db-hdl"></div><div style="display:flex;justify-content:space-between;border-bottom:2px solid #E7ECF5;padding-bottom:10px"><div><h2 style="margin:0;color:#0C419A;font-size:18px;">🎯 SNIPER DASHBOARD</h2></div><div style="display:flex;gap:12px;font-size:11px;align-items:center;color:#545859;"><button id="r-db-cls" style="background:#0C419A;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:bold">✕ Fermer</button></div></div><div id="r-db-grid" class="r-gr"></div>`;D.body.appendChild(db);let isDragging=false,oX,oY;p.querySelector('.r-drg').onmousedown=(e)=>{if(['r-mn','r-rst','r-c'].includes(e.target.id))return;isDragging=true;oX=e.clientX-p.getBoundingClientRect().left;oY=e.clientY-p.getBoundingClientRect().top;};D.onmousemove=(e)=>{if(isDragging){p.style.left=(e.clientX-oX)+'px';p.style.top=(e.clientY-oY)+'px';}};D.onmouseup=()=>isDragging=false;let isResizing=false;E('r-db-hdl').onmousedown=(e)=>{isResizing=true;D.body.style.userSelect="none";e.preventDefault();};D.addEventListener('mousemove',(e)=>{if(isResizing){let w=window.innerWidth-e.clientX;if(w>280&&w<window.innerWidth*0.95)db.style.width=w+'px';}});D.addEventListener('mouseup',()=>{if(isResizing){isResizing=false;D.body.style.userSelect="";}});const openDB=()=>{db.style.opacity="1";db.style.pointerEvents="auto";db.style.transform="translateX(0)";};const closeDB=()=>{db.style.opacity="0";db.style.pointerEvents="none";db.style.transform="translateX(100%)";};E('r-sh-db').onclick=openDB;E('r-db-cls').onclick=closeDB;const escHandler=(e)=>{if(e.key==='Escape')closeDB();};D.addEventListener('keydown',escHandler);E('r-c').onclick=()=>{Q('.'+W+',.'+A).forEach(e=>e.remove());D.removeEventListener('keydown',escHandler);db.remove();p.remove();};E('r-mn').onclick=function(){p.classList.toggle('min');this.textContent=p.classList.contains('min')? '🗖':'─';};function resetSVGViewBoxes(){Q('svg').forEach(v=>{let o=v.getAttribute('data-ro');if(o)v.setAttribute('viewBox',o);});}function createSVGCircle(cls,x,y,col){let c=D.createElementNS(NS,"circle");c.setAttribute("class",cls);c.setAttribute("cx",x);c.setAttribute("cy",y);if(col)c.style.cssText=`stroke:${col};fill:${col};`;return c;}function updateNavigationUI(idx,skipZoom){let currentStatusSpan=E('r-ct'),previewDiv=E('r-pv');Q('.'+W).forEach(e=>e.remove());if(targets.length===0){currentStatusSpan.textContent="0/0";previewDiv.textContent="-";previewDiv.style.display="none";return;}previewDiv.style.display="block";if(mode==="global"){let globalCoords=[];targets.forEach(el=>{let g=el.closest('g');if(g){let b=g.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;if(globalCoords.some(pt=>Math.hypot(pt.x-cx,pt.y-cy)<45))return;globalCoords.push({x:cx,y:cy});g.appendChild(createSVGCircle(W,cx,cy));}});return;}if(idx<0)idx=targets.length-1;if(idx>=targets.length)idx=0;I=idx;let el=targets[I],g=el.closest('g'),svg=el.closest('svg');if(g&&svg){let b=g.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;g.appendChild(createSVGCircle(W,cx,cy));previewDiv.textContent=g.textContent.replace(/\s+/g,' ').trim();currentStatusSpan.textContent=(I+1)+'/'+targets.length;if(!skipZoom){let w=1400,h=900;svg.setAttribute('viewBox',(cx-w/2)+' '+(cy-h/2)+' '+w+' '+h);}}}function searchMapText(){targets=[];let queryValue=E('r-s').value.trim().toLowerCase(),savedPoints=[];if(!queryValue){updateNavigationUI(0);return;}Q('svg text,svg tspan').forEach(el=>{let g=el.closest('g');if(!g)return;if(/^\s*\d{5}\s*[-–]/.test(g.textContent.trim()))return;if(g.textContent.toLowerCase().includes(queryValue)){let b=g.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;if(savedPoints.some(pt=>Math.hypot(pt.x-cx,pt.y-cy)<45))return;savedPoints.push({x:cx,y:cy});targets.push(el);}});updateNavigationUI(0);}E('r-s').oninput=()=>{clearTimeout(tOut);tOut=setTimeout(searchMapText,150);};E('r-s').onfocus=function(){this.select();};E('r-p').onclick=()=>updateNavigationUI(I-1);E('r-nx').onclick=()=>updateNavigationUI(I+1);E('r-m').onclick=function(){mode=mode==="target" ? "global":"target";this.textContent=mode==="target" ? "🎯 Ciblé":"🌐 Global";if(mode==="target")updateNavigationUI(I);else{resetSVGViewBoxes();updateNavigationUI(0);}};E('r-rst').onclick=()=>{E('r-s').value="";Q('.r-ck').forEach(c=>c.checked=false);Q('.'+W+',.'+A).forEach(e=>e.remove());resetSVGViewBoxes();targets=[];I=0;E('r-ct').textContent="0/0";E('r-f-cnt').textContent="0";E('r-pv').textContent="-";E('r-pv').style.display="none";E('r-db-box').style.display="none";closeDB();E('r-db-grid').innerHTML="";};function runFilters(){Q('.'+A).forEach(e=>e.remove());let activeFilters=Array.from(Q('.r-ck')).filter(c=>c.checked).map(c=>T.find(t=>t.id===c.value)).filter(Boolean);if(activeFilters.length===0){E('r-f-cnt').textContent="0";E('r-db-box').style.display="none";closeDB();return;}let count=0,filterCoords=[],gridData={};activeFilters.forEach(a=>gridData[a.id]=[]);Q('svg text,svg tspan').forEach(el=>{let g=el.closest('g');if(!g)return;if(/^\s*\d{5}\s*[-–]/.test(g.textContent.trim()))return;let txt=g.textContent.toLowerCase();let match=activeFilters.find(act=>act.k.some(kwd=>txt.includes(kwd)));if(match){let b=g.getBBox(),cx=b.x+b.width/2,cy=b.y+b.height/2;if(filterCoords.some(pt=>Math.hypot(pt.x-cx,pt.y-cy)<45))return;filterCoords.push({x:cx,y:cy});count++;g.appendChild(createSVGCircle(A,cx,cy,match.c));let cleanedText=g.textContent.replace(/\s+/g,' ').trim();let statusInfo=getStat(g);if(!gridData[match.id].find(i=>i.t===cleanedText)){gridData[match.id].push({t:cleanedText,st:statusInfo});}}});E('r-f-cnt').textContent=count;if(count>0){E('r-db-box').style.display="block";let htmlGrid="";activeFilters.forEach(a=>{let items=gridData[a.id];if(items.length>0){htmlGrid+=`<div class="r-cd" style="border-top:4px solid ${a.c}"><div style="display:flex;justify-content:space-between;margin-bottom:8px;border-bottom:1px solid #E7ECF5;padding-bottom:4px;"><span style="color:${a.c};font-weight:bold;font-size:12px;">■ ${a.n}</span><span style="background:${a.c};color:white;font-weight:bold;font-size:10px;padding:1px 5px;border-radius:10px;">${items.length}</span></div><div style="display:flex;flex-direction:column;overflow-y:auto;max-height:400px!important;gap:2px!important;">${items.map(i=>{let badge=i.st ? `<span style="background:${i.st.c};color:white;font-size:9px;padding:0 4px;border-radius:4px;margin-right:5px;font-weight:bold;">${i.st.s}</span>`:'';return `<div class="r-it" title="${i.t}">${badge}${i.t}</div>`;}).join('')}</div></div>`;}});E('r-db-grid').innerHTML=htmlGrid;}else{E('r-db-box').style.display="none";closeDB();}}Q('.r-ck').forEach(ck=>ck.onchange=runFilters);searchMapText();})();
    }).toString() + "()";
    btn.innerText = "🔭 INSTALLER SNIPER MAP V30";
    btn.style.cssText = "position:fixed;top:20px;right:20px;padding:20px;background:#0C419A;color:white;z-index:9999999;border-radius:8px;cursor:pointer;font-family:sans-serif;font-weight:bold;text-decoration:none;box-shadow:0 4px 6px rgba(0,0,0,0.2);";
    document.body.appendChild(btn);
    setTimeout(() => btn.remove(), 10000);
})();
   ```

   > ⚠️ **Note** : Ce code affiche un bouton temporaire. Cliquez dessus pour installer Sniper Map.### Méthode 2 : Installation manuelle du bookmarklet
1. Créez un nouveau **favori** dans votre navigateur.
2. Comme **URL**, copiez-collez le contenu du fichier [`sniper-map-v30.js`](sniper-map-v30.js).
3. Enregistrez le favori.
4. Dans **Mega Hopex**, cliquez sur le favori pour activer **Sniper Map**. Un panneau flottant apparaîtra.

---

## 🎨 Fonctionnalités

### 1. **Recherche rapide**
- Saisissez un terme dans la barre de recherche pour **surligner les éléments SVG** correspondants.
- Utilisez les boutons **◀ Préc** et **Suiv ▶** pour naviguer entre les résultats.
- Le compteur affiche la position actuelle / nombre total de résultats.

### 2. **Modes de visualisation**
- **🎯 Ciblé** : Centre la vue sur l'élément sélectionné.
- **🌐 Global** : Affiche tous les résultats avec des cercles clignotants.

### 3. **Filtrage par technologie**
Activez/désactivez les filtres pour :
- **EIP** (Bleu #006386)
- **Topic** (Violet #6a0dad)
- **BDD** (Orange #D97706)
- **API** (Bleu #006386)
- **Micro Service** (Rouge #B33F2E)
- **Batch** (Jaune #F0B323)

Les résultats filtrés apparaissent dans le **dashboard latéral** avec :
- Le nombre d'éléments par catégorie.
- La liste des éléments correspondants.

### 4. **Dashboard latéral**
- Ouvrez-le avec le bouton **📊 VOIR LE DASHBOARD**.
- Fermez-le avec le bouton **✕ Fermer** ou la touche **Échap**.
- Redimensionnez-le en glissant la poignée à gauche.

### 5. **Réinitialisation**
- Cliquez sur **↺ Reset** pour :
  - Effacer la recherche.
  - Désactiver tous les filtres.
  - Réinitialiser la vue SVG.
  - Fermer le dashboard.

### 6. **Minimisation du panneau**
- Cliquez sur **─** pour minimiser le panneau.
- Cliquez sur **🗖** pour le restaurer.

### 7. **Fermeture complète**
- Cliquez sur **✕** pour supprimer toutes les instances de **Sniper Map**.

---

## 🎨 Charte graphique

**Sniper Map** respecte la charte graphique **Ameli** :
- **Fond principal** : `#FFFFFF`
- **Couleur primaire** (bordures, focus) : `#0C419A`
- **Couleur secondaire** (accents) : `#006386`
- **Texte** : `#222324`
- **Surfaces de cartes/grilles** : `#F9F9F9`, `#E7ECF5`

---

## 🛠️ Développement

### Structure du projet
```
hopex-search-component/
├── README.md               # Documentation
└── sniper-map-v30.js       # Code source du bookmarklet (V30)
```

### Contribuer
1. Forkez le dépôt.
2. Créez une branche pour vos modifications (`git checkout -b feature/ma-fonctionnalité`).
3. Validez vos changements (`git commit -m "Ajout de ma fonctionnalité"`).
4. Poussez vers votre fork (`git push origin feature/ma-fonctionnalité`).
5. Ouvrez une **Pull Request** vers la branche `main`.

---

## 📜 Historique des versions

| Version | Date       | Description                                                                                     |
|---------|------------|-------------------------------------------------------------------------------------------------|
| V30     | 2024-XX-XX | Version stable. Résolution du bug critique "Unexpected end of input" via `.toString()`.       |

---

## 🤝 Remerciements

- **Mega Hopex** pour l'inspiration et le contexte d'utilisation.
- **Ameli** pour la charte graphique.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

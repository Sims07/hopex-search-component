# Sniper Map (Mega Hopex)

**Outil d'aide à la navigation, filtrage SVG et analyse pour Mega Hopex.**

---

## 📌 À propos

**Sniper Map** est un bookmarklet conçu pour améliorer l'expérience utilisateur dans **Mega Hopex** en offrant :
- Une **recherche rapide** dans les éléments SVG, combinable avec les filtres actifs.
- Un **filtrage par nature de composant** (EIP, Topic, BDD, API, Micro Service, Batch), **entièrement personnalisable** (ajout, édition, suppression), **sauvegardé automatiquement**, et **exportable/partageable** entre collègues.
- Une **visualisation ciblée** ou globale des résultats.
- Un **dashboard latéral** pour analyser les résultats filtrés, avec **export CSV**.
- Une **intégration discrète** via un panneau flottant.

---

## 🚀 Installation

### Méthode 1 : Installation automatique par Glisser-déposer (Recommandé)
Pour contourner les limitations de taille et de formatage de l'IHM de Edge/Chrome, utilisez notre page d'installation :

1. Ouvrez la page **https://sims07.github.io/hopex-search-component/install.html** (ou son équivalent via GitHub Pages si configuré).
2. Glissez et déposez (Drag & Drop) le bouton bleu **🎯 Sniper Map** directement dans votre **barre de favoris** du navigateur.
3. Allez sur votre instance **Mega Hopex**, puis cliquez sur le favori pour activer l'outil.

> 🔄 **Mise à jour transparente** : La page d'installation nettoie automatiquement les commentaires du script brut. Inutile de recréer le favori lors des prochaines mises à jour du code source sur GitHub !

### Méthode 2 : Exécution temporaire via la Console
1. Ouvrez **Mega Hopex** dans votre navigateur.
2. Ouvrez la console de développement (**F12** ou **Ctrl+Shift+I**).
3. Copiez l'intégralité du contenu du fichier **[sniper-map.js](sniper-map.js)**, collez-le dans la console, puis appuyez sur **Entrée**.

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

> Ces 6 filtres sont les valeurs **par défaut**. Ils peuvent être modifiés librement via la gestion des filtres (voir ci-dessous).

> 🔎 **Recherche croisée** : si vous saisissez un terme dans la barre de recherche pendant qu'un ou plusieurs filtres sont actifs, seuls les éléments correspondant **à la fois** au(x) filtre(s) et au terme recherché sont affichés dans le dashboard et sur la carte (ex : rechercher "paiement" avec le filtre "Batch" actif n'affiche que les flux Batch contenant "paiement"). Un sous-titre dans le dashboard indique le terme de recherche appliqué.

### 4. **Gestion des filtres (CRUD)**
Cliquez sur l'icône **⚙️** à côté du titre "FILTRES" pour ouvrir la fenêtre de gestion. Vous pouvez :
- **➕ Ajouter** un nouveau filtre (bouton "+ Ajouter un filtre").
- **✏️ Modifier** le nom, la couleur et les mots-clés de n'importe quel filtre (les mots-clés se saisissent séparés par des virgules, ex. `api, rest, endpoint`).
- **🗑️ Supprimer** un filtre existant (confirmation demandée).
- **↺ Réinitialiser** l'ensemble des filtres aux 6 valeurs par défaut (EIP, Topic, BDD, API, Micro Service, Batch).
- **⬇️ Exporter** votre configuration de filtres au format `.json`.
- **⬆️ Importer** un fichier `.json` de filtres (remplace la configuration actuelle, confirmation demandée) — pratique pour partager un set de filtres standard entre collègues.

Chaque modification est **automatiquement sauvegardée dans le localStorage de votre navigateur** : vos filtres personnalisés sont conservés d'une session à l'autre, sans avoir à les recréer. Cette sauvegarde est locale à votre navigateur/poste (elle n'est pas partagée entre utilisateurs ni entre navigateurs différents) — d'où l'intérêt de l'export/import pour la diffuser en équipe.

### 5. **Dashboard latéral**
- Ouvrez-le avec le bouton **📊 VOIR LE DASHBOARD**.
- Fermez-le avec le bouton **✕ Fermer** ou la touche **Échap**.
- Redimensionnez-le en glissant la poignée à gauche.
- **⬇️ Export CSV** : exportez les résultats actuellement affichés (filtre, nom du composant, statut) dans un fichier `.csv` compatible Excel (accents et séparateur `;` gérés). Pratique pour un compte-rendu ou une revue d'impact. Le bouton n'exporte que ce qui est visible à l'instant T (filtres actifs + recherche éventuelle).

### 6. **Réinitialisation**
- Cliquez sur **↺ Reset** pour :
  - Effacer la recherche.
  - Désactiver tous les filtres.
  - Réinitialiser la vue SVG.
  - Fermer le dashboard.

> ℹ️ Ce bouton "↺ Reset" réinitialise l'état de recherche/affichage, **pas** la liste des filtres personnalisés. Pour revenir aux 6 filtres par défaut, utilisez le bouton "↺ Défaut" dans la fenêtre de gestion des filtres (⚙️).

### 7. **Minimisation du panneau**
- Cliquez sur **─** pour minimiser le panneau.
- Cliquez sur **🗖** pour le restaurer.

### 8. **Fermeture complète**
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
├── install.html            # Page d'installation automatique (Drag & Drop)
└── sniper-map.js           # Code source non minifié du bookmarklet (V37)
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
| V0.0.37    | 2026-07-02 | **Correctif** : les flux (identifiés par un code du type `NNNNN - Libellé`) n'étaient plus détectés en recherche ni en filtrage, à cause d'une exclusion trop large destinée aux légendes. **Nouveautés** : export CSV des résultats du dashboard, croisement recherche texte + filtres actifs, import/export JSON de la configuration des filtres (partage d'équipe). |
| V0.0.36    | 2026-07-02 | Ajout de la **gestion CRUD des filtres** (créer, éditer, supprimer, réinitialiser) via une fenêtre dédiée, avec **sauvegarde automatique en localStorage** pour conserver les filtres personnalisés d'une session à l'autre. |
| V0.0.35    | 2026-07-01 | Intégration de `install.html`. Résolution définitive du bug `Unexpected end of input` lié à l'IHM des navigateurs et aux commentaires monolignes. |

---

## 🤝 Remerciements

- **Mega Hopex** pour l'inspiration et le contexte d'utilisation.
- **Ameli** pour la charte graphique.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour plus de

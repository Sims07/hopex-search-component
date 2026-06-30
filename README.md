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
3. Copiez le contenu du fichier **[sniper-map-v30.js](sniper-map-v30.js)** et collez-le dans la console, puis exécutez-le.

   > ⚠️ **Note** : Cette méthode installe directement Sniper Map sans bouton intermédiaire.

### Méthode 2 : Installation manuelle du bookmarklet
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

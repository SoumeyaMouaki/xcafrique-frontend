# XC Afrique - Frontend

Frontend du blog professionnel **XC Afrique - Le Cross-check de l'info aérienne**, développé avec React.js et Tailwind CSS.

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque JavaScript pour construire l'interface utilisateur
- **React Router** - Routage côté client
- **Tailwind CSS** - Framework CSS utilitaire
- **Vite** - Outil de build moderne et rapide

## 📁 Structure du projet

```
XCAfrique-Frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Header.jsx       # En-tête avec navigation
│   │   ├── Footer.jsx       # Pied de page
│   │   ├── ArticleCard.jsx  # Carte d'article
│   │   ├── CategoryList.jsx # Liste des catégories
│   │   ├── ContactForm.jsx  # Formulaire de contact
│   │   └── SEO.jsx          # Gestion SEO dynamique
│   ├── pages/               # Pages principales
│   │   ├── Home.jsx         # Page d'accueil
│   │   ├── Categories.jsx   # Page catégories
│   │   ├── ArticleDetail.jsx # Page article détaillé
│   │   ├── About.jsx        # Page à propos
│   │   └── Contact.jsx      # Page contact
│   ├── data/                # Données fictives
│   │   └── articles.js       # Articles et catégories
│   ├── App.jsx              # Composant principal avec routing
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles Tailwind
├── index.html               # HTML principal
├── package.json             # Dépendances
├── vite.config.js           # Configuration Vite
├── tailwind.config.js       # Configuration Tailwind
└── postcss.config.js        # Configuration PostCSS
```

## 🎨 Design

- **Palette de couleurs** :
  - Bleu foncé principal : `#1e3a5f`
  - Accent doré : `#d4af37`
  - Accent gris : `#718096`
  
- **Typographie** : Poppins et Inter (sans-serif moderne)

- **Style** : Newsroom professionnel, sérieux et crédible

## ✨ Fonctionnalités

### Pages principales
- ✅ **Accueil** : Bannière, articles récents, section "À la une"
- ✅ **Catégories** : Liste des catégories et articles par catégorie
- ✅ **Article détaillé** : Contenu complet avec partage réseaux sociaux
- ✅ **À propos** : Présentation du blog et de la journaliste
- ✅ **Contact** : Formulaire de contact fonctionnel

### Composants réutilisables
- ✅ Header avec navigation responsive
- ✅ Footer avec newsletter et liens
- ✅ ArticleCard pour afficher les articles
- ✅ CategoryList pour la navigation par catégorie
- ✅ ContactForm avec validation

### Optimisations
- ✅ **Responsive** : Desktop, tablette, mobile
- ✅ **SEO friendly** : Balises meta dynamiques, titres H1/H2/H3
- ✅ **Performances** : Lazy loading des images, code optimisé
- ✅ **Accessibilité** : Attributs ARIA, navigation clavier

## 🛠️ Installation

1. **Installer les dépendances** :
```bash
npm install
```

2. **Lancer le serveur de développement** :
```bash
npm run dev
```

3. **Build pour la production** :
```bash
npm run build
```

4. **Prévisualiser le build de production** :
```bash
npm run preview
```

## 📝 Données fictives

Le projet inclut des articles fictifs dans `src/data/articles.js` pour tester l'affichage. Ces données peuvent être remplacées par des appels API vers un backend.

## 🔗 Routes disponibles

- `/` - Page d'accueil
- `/categories` - Toutes les catégories
- `/categories/:category` - Articles d'une catégorie spécifique
- `/article/:id` - Article détaillé
- `/about` - À propos
- `/contact` - Contact

## 🚧 Prochaines étapes

Pour intégrer un backend :
1. Remplacer les données fictives dans `src/data/articles.js` par des appels API
2. Connecter le formulaire de contact à un endpoint backend
3. Ajouter la gestion d'état (Redux, Context API, ou Zustand) si nécessaire
4. Implémenter l'authentification si des fonctionnalités admin sont nécessaires

## 📚 Documentation

- `API_DOCUMENTATION.md` - Documentation complète de l'API backend
- `BACKEND_SETUP.md` - Guide de configuration backend
- `ENV_EXAMPLE.md` - Exemple de variables d'environnement
- `TROUBLESHOOTING.md` - Guide de dépannage des erreurs courantes
- `VERCEL_FRONTEND_URL_CONFIG.md` - Configuration FRONTEND_URL_PROD pour Vercel

## 📄 Licence

Ce projet est un frontend de démonstration pour le blog XC Afrique.


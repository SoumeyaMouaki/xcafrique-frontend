# Guide de démarrage rapide - XC Afrique Frontend

## 🚀 Installation et lancement

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

### 3. Build pour la production
```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

## 📋 Structure des pages

- **Accueil** (`/`) : Bannière, articles récents, section "À la une"
- **Catégories** (`/categories`) : Liste de toutes les catégories
- **Catégorie spécifique** (`/categories/:category`) : Articles d'une catégorie
- **Article** (`/article/:id`) : Article détaillé avec partage
- **À propos** (`/about`) : Présentation du blog
- **Contact** (`/contact`) : Formulaire de contact

## 🎨 Personnalisation

### Couleurs
Modifiez `tailwind.config.js` pour changer les couleurs :
- `primary-dark` : Bleu foncé principal
- `accent-gold` : Accent doré
- `accent-gray` : Accent gris

### Articles
Les articles fictifs sont dans `src/data/articles.js`. Remplacez-les par des appels API pour connecter un backend.

### Styles
Les styles globaux sont dans `src/index.css`. Les composants utilisent Tailwind CSS.

## 🔧 Technologies

- React 18
- React Router 6
- Tailwind CSS 3
- Vite 5

## 📝 Notes

- Les images utilisent des URLs Unsplash pour la démonstration
- Le formulaire de contact simule un envoi (à connecter au backend)
- Le SEO est géré dynamiquement via le composant `SEO.jsx`


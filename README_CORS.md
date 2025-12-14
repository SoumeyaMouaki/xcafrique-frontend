# 🔧 Solution au problème CORS - Guide rapide

## ⚡ Solution immédiate

**Redémarrez simplement le serveur de développement :**

```bash
# Arrêtez le serveur actuel (Ctrl+C)
npm run dev
```

Un **proxy Vite** a été configuré pour contourner automatiquement les problèmes CORS en développement.

## 📋 Ce qui a été fait

1. ✅ **Proxy Vite configuré** dans `vite.config.js`
   - Redirige toutes les requêtes `/api` vers `http://localhost:5000/api`
   - Évite les problèmes CORS en développement

2. ✅ **Configuration API mise à jour** dans `src/api.js`
   - Utilise `/api` en développement (via proxy)
   - Utilise l'URL complète en production

3. ✅ **Messages d'erreur améliorés**
   - Détection automatique des erreurs CORS
   - Messages clairs avec instructions

## 🔍 Vérification

Après avoir redémarré :

1. Ouvrez la console du navigateur (F12)
2. Les erreurs CORS devraient avoir disparu
3. Les articles et catégories devraient se charger correctement

## 🚨 Si le problème persiste

### Option 1 : Vérifier que le backend est démarré

```bash
# Dans le dossier du backend
npm start
# ou
npm run dev
```

### Option 2 : Modifier la configuration CORS du backend

Dans votre fichier backend (ex: `server.js`), modifiez la configuration CORS :

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',  // Ancien frontend
    'http://localhost:5173',   // Vite (actuel)
  ],
  credentials: true
}));
```

Ou pour autoriser toutes les origines en développement :

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com' 
    : true,
  credentials: true
}));
```

## 📚 Documentation complète

Consultez `CORS_FIX.md` pour plus de détails et d'options.


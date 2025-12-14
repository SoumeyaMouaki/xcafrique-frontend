# Solution au problème CORS

## Problème

Le backend autorise uniquement `http://localhost:3000` mais Vite tourne sur `http://localhost:5173`, ce qui cause des erreurs CORS.

## Solution 1 : Proxy Vite (Recommandé pour le développement)

Un proxy Vite a été configuré dans `vite.config.js`. Cela permet de contourner les problèmes CORS en développement.

### Comment ça fonctionne

Le proxy redirige toutes les requêtes `/api` vers `http://localhost:5000/api` côté serveur, évitant ainsi les problèmes CORS.

### Utilisation

1. **Redémarrez le serveur de développement** :
   ```bash
   # Arrêtez le serveur actuel (Ctrl+C)
   npm run dev
   ```

2. Le frontend utilisera automatiquement le proxy. Les requêtes vers `/api` seront redirigées vers le backend.

## Solution 2 : Modifier la configuration CORS du backend

Si vous préférez modifier le backend, voici comment configurer CORS pour autoriser `http://localhost:5173` :

### Avec Express et cors

Dans votre fichier backend (probablement `server.js` ou `app.js`) :

```javascript
const cors = require('cors');

// Configuration CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Ancien frontend
    'http://localhost:5173',  // Vite dev server
    'http://localhost:5174',  // Alternative Vite
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Ou pour autoriser toutes les origines en développement :

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com' 
    : true, // Autorise toutes les origines en développement
  credentials: true
};

app.use(cors(corsOptions));
```

### Variables d'environnement

Dans votre fichier `.env` du backend :

```env
FRONTEND_URL=http://localhost:5173
# Ou pour autoriser plusieurs origines
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

## Vérification

Après avoir appliqué une des solutions :

1. Redémarrez le backend
2. Redémarrez le frontend (`npm run dev`)
3. Vérifiez la console du navigateur - les erreurs CORS devraient disparaître

## Production

En production, assurez-vous que :
- Le backend autorise l'origine de votre frontend de production
- Les URLs sont correctement configurées dans les variables d'environnement
- Le proxy Vite n'est pas utilisé (il est uniquement pour le développement)


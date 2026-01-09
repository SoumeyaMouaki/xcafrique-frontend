# 🔧 Correction du double /api/api/

## Problème identifié

Le frontend envoyait des requêtes vers :
```
POST https://xcafrique-backend.vercel.app/api/api/contact
```

Au lieu de :
```
POST https://xcafrique-backend.vercel.app/api/contact
```

## ✅ Solution appliquée

### 1. Correction dans `src/api.js`

Le code nettoie maintenant automatiquement l'URL si elle contient déjà `/api` :

```javascript
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://xcafrique-backend.vercel.app'
    // Nettoyer l'URL si elle contient déjà /api
    const cleanUrl = baseUrl.replace(/\/api\/?$/, '')
    // Ajouter /api à la fin
    return `${cleanUrl}/api`
  }
  return "/api"
}
```

**Résultat** :
- ✅ `https://xcafrique-backend.vercel.app` → `https://xcafrique-backend.vercel.app/api`
- ✅ `https://xcafrique-backend.vercel.app/api` → `https://xcafrique-backend.vercel.app/api` (nettoyé)
- ✅ `http://localhost:5000` → `http://localhost:5000/api`

### 2. Vérification des appels API

Tous les appels API utilisent des chemins relatifs (sans `/api` au début) :

```javascript
// ✅ Correct
API.post('/contact', data)        // Devient /api/contact
API.get('/articles')              // Devient /api/articles
API.get('/articles/:slug')        // Devient /api/articles/:slug

// ❌ Incorrect (ne pas faire)
API.post('/api/contact', data)     // Devient /api/api/contact
```

## 📋 Actions à effectuer

### 1. Vérifier la variable d'environnement Vercel

Sur Vercel, vérifiez que `VITE_API_URL` est configurée **SANS `/api`** :

```
✅ Correct : https://xcafrique-backend.vercel.app
❌ Incorrect : https://xcafrique-backend.vercel.app/api
```

### 2. Redéployer le frontend

Après la correction, redéployez votre frontend sur Vercel pour que les changements prennent effet.

### 3. Vérifier les requêtes

Ouvrez la console du navigateur (F12) > Network et vérifiez que les requêtes sont maintenant :
- ✅ `https://xcafrique-backend.vercel.app/api/contact`
- ❌ Plus de `https://xcafrique-backend.vercel.app/api/api/contact`

## 🔍 Comment tester

1. **Ouvrez la console du navigateur** (F12)
2. **Allez dans l'onglet Network**
3. **Envoyez un message de contact** ou effectuez une action qui appelle l'API
4. **Vérifiez l'URL de la requête** :
   - Doit être : `https://xcafrique-backend.vercel.app/api/...`
   - Ne doit PAS être : `https://xcafrique-backend.vercel.app/api/api/...`

## ✅ Résultat

Le problème est maintenant corrigé. Le code :
- Nettoie automatiquement les URLs qui contiennent déjà `/api`
- Ajoute `/api` seulement si nécessaire
- Évite le double `/api/api/` dans tous les cas


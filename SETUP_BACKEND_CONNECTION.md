# 🔌 Guide de connexion Backend/Frontend

## Problème : Backend et Frontend ne sont pas connectés

### ✅ Solution rapide

#### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_API_URL=http://localhost:5000
```

**Important** : Le fichier `.env` est dans `.gitignore` (normal, il ne doit pas être commité).

#### 2. Vérifier que le backend est démarré

Le backend doit être démarré sur `http://localhost:5000` :

```bash
# Dans le dossier du backend
npm start
# ou
node server.js
# ou selon votre configuration backend
```

#### 3. Vérifier la configuration du proxy Vite

Le fichier `vite.config.js` est déjà configuré pour rediriger `/api` vers `http://localhost:5000` :

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
  }
}
```

#### 4. Redémarrer le serveur de développement

Après avoir créé le `.env`, redémarrez le serveur Vite :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

---

## 🔍 Vérification de la connexion

### Test 1 : Vérifier que le backend répond

Ouvrez dans votre navigateur :
```
http://localhost:5000/api/articles
```

Vous devriez voir une réponse JSON. Si vous voyez une erreur, le backend n'est pas démarré.

### Test 2 : Vérifier le proxy Vite

Avec le frontend démarré (`npm run dev`), ouvrez :
```
http://localhost:5173/api/articles
```

Le proxy Vite devrait rediriger vers `http://localhost:5000/api/articles`.

### Test 3 : Vérifier dans la console du navigateur

Ouvrez les DevTools (F12) et regardez l'onglet **Network** :
- Les requêtes vers `/api/*` doivent avoir le statut **200** (succès) ou **404** (endpoint inexistant)
- Si vous voyez **ERR_CONNECTION_REFUSED** ou **CORS error**, le backend n'est pas démarré

---

## ⚠️ Endpoints manquants (404)

Si vous voyez des erreurs 404 pour :
- `/api/videos` → Cet endpoint n'existe peut-être pas dans votre backend
- `/api/contact` → Cet endpoint n'existe peut-être pas dans votre backend

### Solutions

#### Option 1 : Créer les endpoints dans le backend

Ajoutez ces routes dans votre backend :
- `GET /api/videos` - Liste des vidéos
- `POST /api/contact` - Envoi de message de contact

#### Option 2 : Désactiver temporairement ces fonctionnalités

Si les endpoints n'existent pas encore, les composants gèrent déjà les erreurs silencieusement :
- `VideosSection` : N'affiche rien si aucune vidéo
- `ContactForm` : Affiche un message d'erreur

---

## 🛠️ Configuration complète

### Fichier `.env` (à créer)

```env
# Configuration API Backend
# En développement, le proxy Vite est utilisé (voir vite.config.js)
# En production, définissez l'URL complète de votre API

# URL de base de l'API (sans /api à la fin)
VITE_API_URL=http://localhost:5000
```

### Structure des URLs

- **Développement** : Le proxy Vite redirige `/api/*` → `http://localhost:5000/api/*`
- **Production** : Utilise directement `VITE_API_URL/api/*`

---

## 🐛 Dépannage

### Erreur : "ERR_CONNECTION_REFUSED"

**Cause** : Le backend n'est pas démarré

**Solution** :
1. Vérifiez que le backend est démarré sur le port 5000
2. Testez `http://localhost:5000/api/articles` dans le navigateur
3. Vérifiez les logs du backend

### Erreur : "CORS policy"

**Cause** : Le backend n'autorise pas les requêtes depuis `http://localhost:5173`

**Solution** :
1. Le proxy Vite devrait résoudre ce problème automatiquement
2. Si le problème persiste, vérifiez la configuration CORS du backend
3. Assurez-vous que le proxy Vite est bien configuré dans `vite.config.js`

### Erreur : "404 Not Found" pour certains endpoints

**Cause** : L'endpoint n'existe pas dans le backend

**Solution** :
1. Vérifiez la documentation de votre backend
2. Créez l'endpoint manquant
3. Ou désactivez temporairement la fonctionnalité dans le frontend

### Le fichier `.env` n'est pas pris en compte

**Solution** :
1. Vérifiez que le fichier est bien à la racine du projet
2. Redémarrez le serveur de développement (`npm run dev`)
3. Vérifiez que la variable commence par `VITE_`

---

## 📋 Checklist de vérification

- [ ] Fichier `.env` créé avec `VITE_API_URL=http://localhost:5000`
- [ ] Backend démarré sur `http://localhost:5000`
- [ ] Serveur frontend redémarré après création du `.env`
- [ ] Test de `http://localhost:5000/api/articles` fonctionne
- [ ] Test de `http://localhost:5173/api/articles` fonctionne (via proxy)
- [ ] Pas d'erreurs CORS dans la console
- [ ] Les endpoints utilisés existent dans le backend

---

## 🔗 Endpoints utilisés par le frontend

### Articles
- ✅ `GET /api/articles` - Liste des articles
- ✅ `GET /api/articles/:slug` - Détails d'un article

### Catégories
- ✅ `GET /api/categories` - Liste des catégories

### Vidéos
- ⚠️ `GET /api/videos` - Liste des vidéos (peut ne pas exister)
- ⚠️ `GET /api/videos?limit=6` - Vidéos limitées (peut ne pas exister)

### Contact
- ⚠️ `POST /api/contact` - Envoi de message (peut ne pas exister)

### Newsletter
- ⚠️ `GET /api/newsletter/stats` - Statistiques newsletter
- ⚠️ `POST /api/newsletter/subscribe` - Abonnement newsletter
- ⚠️ `GET /api/newsletter/stream` - Stream SSE/WebSocket

**Note** : Les endpoints marqués ⚠️ peuvent ne pas exister dans votre backend. Le frontend gère ces erreurs gracieusement.


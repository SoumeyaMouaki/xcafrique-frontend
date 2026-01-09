# 🔧 Configuration Backend pour XCAfrique Frontend

## 📋 Checklist de configuration backend

### 1. ✅ Configuration CORS

Le backend **DOIT** autoriser les requêtes depuis votre frontend.

#### Configuration CORS recommandée

```javascript
// Exemple avec Express.js
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',           // Développement local (Vite)
    'http://localhost:3000',            // Alternative dev
    'https://xcafrique.org',            // Production frontend
    'https://*.vercel.app',             // Preview deployments Vercel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

**Important** : 
- ✅ Autorisez `https://xcafrique.org` pour la production
- ✅ Autorisez `http://localhost:5173` pour le développement
- ✅ Autorisez `https://*.vercel.app` pour les preview deployments

---

### 2. ✅ Endpoints requis

Le frontend utilise ces endpoints. Assurez-vous qu'ils existent dans votre backend :

#### Articles (✅ Requis)

```javascript
// Liste des articles publiés
GET /api/articles
Query params: ?page=1&limit=10&category=slug&search=terme

// Détails d'un article par slug
GET /api/articles/:slug
```

**Format de réponse attendu** :
```json
{
  "success": true,
  "data": [...],  // ou { data: [...] } pour les listes
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5
}
```

#### Catégories (✅ Requis)

```javascript
// Liste des catégories actives
GET /api/categories

// Détails d'une catégorie par ID
GET /api/categories/:id
```

**Format de réponse attendu** :
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

#### Vidéos (⚠️ Optionnel)

```javascript
// Liste des vidéos
GET /api/videos
Query params: ?limit=6

// Si cet endpoint n'existe pas, le frontend gère l'erreur silencieusement
```

#### Contact (⚠️ Optionnel)

```javascript
// Envoi de message de contact
POST /api/contact
Body: {
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

#### Newsletter (⚠️ Optionnel)

```javascript
// Statistiques newsletter
GET /api/newsletter/stats

// Abonnement newsletter
POST /api/newsletter/subscribe
Body: {
  "email": "string"
}

// Stream pour notifications en temps réel (WebSocket/SSE)
GET /api/newsletter/stream
// ou WebSocket: ws://.../api/newsletter/stream
```

---

### 3. ✅ Structure des réponses API

Le frontend s'attend à cette structure standardisée :

#### Succès (liste)

```json
{
  "success": true,
  "data": [...],
  "count": 10,        // Nombre d'éléments dans la page
  "total": 50,        // Nombre total d'éléments
  "page": 1,          // Page actuelle
  "pages": 5          // Nombre total de pages
}
```

#### Succès (objet unique)

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    ...
  }
}
```

#### Erreur

```json
{
  "success": false,
  "message": "Message d'erreur descriptif"
}
```

---

### 4. ✅ Configuration pour Vercel (si backend déployé)

Si votre backend est déployé sur Vercel (`https://xcafrique-backend.vercel.app`) :

#### Variables d'environnement Vercel

Assurez-vous que ces variables sont configurées :

```env
# Base de données MongoDB
MONGODB_URI=mongodb+srv://...

# CORS - Domaines autorisés (séparés par des virgules)
ALLOWED_ORIGINS=http://localhost:5173,https://xcafrique.org,https://*.vercel.app

# Autres variables selon votre backend
NODE_ENV=production
```

#### Configuration CORS dynamique

```javascript
// Lire les domaines autorisés depuis les variables d'environnement
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://xcafrique.org'];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origin est autorisé
    if (allowedOrigins.some(allowed => {
      // Support des wildcards comme *.vercel.app
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

### 5. ✅ Vérifications à faire

#### Test 1 : Vérifier que le backend répond

```bash
# Test de base
curl https://xcafrique-backend.vercel.app/api/articles

# Devrait retourner du JSON
```

#### Test 2 : Vérifier CORS

```bash
# Test CORS depuis le frontend
curl -H "Origin: https://xcafrique.org" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://xcafrique-backend.vercel.app/api/articles

# Devrait retourner les headers CORS
```

#### Test 3 : Vérifier les endpoints

Testez chaque endpoint utilisé par le frontend :

```bash
# Articles
curl https://xcafrique-backend.vercel.app/api/articles
curl https://xcafrique-backend.vercel.app/api/articles/example-slug

# Catégories
curl https://xcafrique-backend.vercel.app/api/categories

# Vidéos (si existe)
curl https://xcafrique-backend.vercel.app/api/videos

# Contact (si existe)
curl -X POST https://xcafrique-backend.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test"}'
```

---

### 6. ✅ Gestion des erreurs

Le backend doit retourner des codes HTTP appropriés :

- **200** : Succès
- **400** : Erreur de validation (données invalides)
- **401** : Non autorisé (token manquant/invalide)
- **404** : Ressource non trouvée
- **500** : Erreur serveur

**Format d'erreur standardisé** :
```json
{
  "success": false,
  "message": "Message d'erreur descriptif",
  "error": "ERROR_CODE" // Optionnel
}
```

---

### 7. ✅ Endpoints utilisés par le frontend

#### Articles

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| GET | `/api/articles` | Liste des articles | ✅ Requis |
| GET | `/api/articles/:slug` | Détails article | ✅ Requis |

#### Catégories

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| GET | `/api/categories` | Liste catégories | ✅ Requis |
| GET | `/api/categories/:id` | Détails catégorie | ✅ Requis |

#### Vidéos

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| GET | `/api/videos` | Liste vidéos | ⚠️ Optionnel |
| GET | `/api/videos?limit=6` | Vidéos limitées | ⚠️ Optionnel |

#### Contact

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| POST | `/api/contact` | Envoi message | ⚠️ Optionnel |

#### Newsletter

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| GET | `/api/newsletter/stats` | Statistiques | ⚠️ Optionnel |
| POST | `/api/newsletter/subscribe` | Abonnement | ⚠️ Optionnel |
| GET/WS | `/api/newsletter/stream` | Notifications temps réel | ⚠️ Optionnel |

---

### 8. ✅ Structure des données Article

Le frontend s'attend à cette structure pour un article :

```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string (HTML ou Markdown)",
  "category": {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "color": "#FF5733"
  },
  "author": "string",
  "featuredImage": "string (URL)",
  "tags": ["string"],
  "publishedAt": "ISO date string",
  "views": 0,
  "status": "published",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Points importants** :
- ✅ Le `slug` est utilisé pour les URLs (pas l'ID)
- ✅ Seuls les articles avec `status: "published"` sont affichés
- ✅ La catégorie doit être "populée" (objet complet, pas juste l'ID)
- ✅ `publishedAt` est utilisé pour le tri (plus récent en premier)

---

### 9. ✅ Structure des données Category

```json
{
  "_id": "string",
  "name": "string",
  "slug": "string",
  "description": "string (optionnel)",
  "color": "#FF5733",
  "isActive": true,
  "articleCount": 12,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

**Points importants** :
- ✅ Seules les catégories avec `isActive: true` sont affichées
- ✅ `articleCount` indique le nombre d'articles publiés dans cette catégorie

---

### 10. ✅ Pagination

Les endpoints de liste doivent supporter la pagination :

**Query parameters** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)

**Réponse** :
```json
{
  "success": true,
  "data": [...],
  "count": 10,    // Éléments dans cette page
  "total": 50,    // Total d'éléments
  "page": 1,      // Page actuelle
  "pages": 5      // Nombre total de pages
}
```

---

### 11. ✅ Filtres et recherche

#### Filtre par catégorie

```
GET /api/articles?category=finance
GET /api/articles?category=507f1f77bcf86cd799439011
```

Accepte soit le slug, soit l'ID MongoDB.

#### Recherche textuelle

```
GET /api/articles?search=aviation
```

Recherche dans : `title`, `content`, `excerpt`, `tags`

---

## 🚀 Déploiement sur Vercel

### Configuration `vercel.json` (backend)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Variables d'environnement Vercel (backend)

Configurez dans **Settings > Environment Variables** :

```
MONGODB_URI=mongodb+srv://...
ALLOWED_ORIGINS=http://localhost:5173,https://xcafrique.org,https://*.vercel.app
JWT_SECRET=your-secret-key
NODE_ENV=production
```

---

## 📝 Résumé des actions backend

1. ✅ **Configurer CORS** pour accepter `https://xcafrique.org` et `http://localhost:5173`
2. ✅ **Vérifier les endpoints** requis (`/api/articles`, `/api/categories`)
3. ✅ **Standardiser les réponses** avec `{ success, data, ... }`
4. ✅ **Utiliser les slugs** pour les articles (pas les IDs)
5. ✅ **Filtrer les articles publiés** (`status: "published"`)
6. ✅ **Implémenter la pagination** pour les listes
7. ✅ **Configurer les variables d'environnement** sur Vercel
8. ✅ **Tester les endpoints** avec curl ou Postman

---

## 🔗 Documentation API complète

Consultez `API_DOCUMENTATION.md` dans le frontend pour la documentation complète de l'API attendue.

---

## ❓ Besoin d'aide ?

Si vous avez des questions sur la configuration backend, vérifiez :
1. Les logs du backend (erreurs CORS, 404, etc.)
2. La console du navigateur (erreurs réseau)
3. Les headers de réponse (CORS headers présents ?)


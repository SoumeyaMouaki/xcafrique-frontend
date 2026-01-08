# 📚 Documentation API Frontend - XC Afrique

Documentation complète de l'API backend pour la synchronisation avec le frontend React.

## 🌐 Configuration de base

### Base URL
```
http://localhost:5000/api
```
En production, remplacer par l'URL du backend déployé.

### Headers requis
Toutes les requêtes doivent inclure :
```javascript
{
  'Content-Type': 'application/json'
}
```

### Format de réponse standard
Toutes les réponses suivent ce format :
```typescript
{
  success: boolean;
  message?: string;
  data?: any;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}
```

---

## 📝 Endpoints Articles

### 1. Liste des articles publiés

**Endpoint :** `GET /api/articles`

**Description :** Récupère la liste des articles publiés avec pagination et filtres optionnels.

**Query Parameters :**
| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `page` | number | Non | `1` | Numéro de page |
| `limit` | number | Non | `10` | Nombre d'articles par page |
| `category` | string | Non | - | Slug ou ID de la catégorie |
| `search` | string | Non | - | Recherche textuelle |

**Exemple de requête :**
```javascript
// Tous les articles
GET /api/articles

// Avec pagination
GET /api/articles?page=2&limit=20

// Filtrer par catégorie (slug)
GET /api/articles?category=finance

// Filtrer par catégorie (ID MongoDB)
GET /api/articles?category=507f1f77bcf86cd799439011

// Recherche textuelle
GET /api/articles?search=aviation

// Combinaison de filtres
GET /api/articles?category=finance&page=1&limit=10&search=ethiopie
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Titre de l'article",
      "slug": "titre-de-l-article",
      "excerpt": "Résumé court de l'article...",
      "content": "Contenu complet en HTML ou Markdown...",
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Finance",
        "slug": "finance",
        "color": "#FF5733"
      },
      "author": "Admin XC Afrique",
      "featuredImage": "https://example.com/image.jpg",
      "tags": ["tag1", "tag2", "tag3"],
      "publishedAt": "2026-01-08T10:00:00.000Z",
      "views": 42,
      "status": "published",
      "createdAt": "2026-01-08T10:00:00.000Z",
      "updatedAt": "2026-01-08T10:00:00.000Z"
    }
  ]
}
```

**Notes importantes :**
- ✅ Seuls les articles avec `status: "published"` sont retournés (automatique)
- ✅ Les articles sont triés par `publishedAt` (plus récent en premier), puis par `createdAt`
- ✅ Si une catégorie n'existe pas, un tableau vide est retourné (pas d'erreur 404)
- ✅ La recherche est insensible à la casse et cherche dans : `title`, `content`, `excerpt`, `tags`

**Gestion des erreurs :**
- `500` : Erreur serveur
- `200` : Succès (même si aucun résultat, retourne `data: []`)

---

### 2. Détails d'un article par slug

**Endpoint :** `GET /api/articles/:slug`

**Description :** Récupère les détails complets d'un article par son slug. **Le compteur de vues est incrémenté automatiquement** à chaque requête.

**Paramètres URL :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `slug` | string | Slug unique de l'article (ex: `ethiopie-2025-2026-ethiopian-airlines`) |

**Exemple de requête :**
```javascript
GET /api/articles/ethiopie-2025-2026-ethiopian-airlines
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Éthiopie 2025-2026 : Ethiopian Airlines signe avec Archer Aviation",
    "slug": "ethiopie-2025-2026-ethiopian-airlines",
    "excerpt": "Résumé court...",
    "content": "Contenu complet en HTML ou Markdown...",
    "category": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Finance",
      "slug": "finance",
      "color": "#FF5733",
      "description": "Description de la catégorie"
    },
    "author": "Admin XC Afrique",
    "featuredImage": "https://example.com/image.jpg",
    "tags": ["Éthiopie", "Ethiopian Airlines", "eVTOL"],
    "publishedAt": "2026-01-08T10:00:00.000Z",
    "views": 43,
    "status": "published",
    "createdAt": "2026-01-08T10:00:00.000Z",
    "updatedAt": "2026-01-08T10:00:00.000Z"
  }
}
```

**Gestion des erreurs :**
- `404` : Article non trouvé ou non publié
  ```json
  {
    "success": false,
    "message": "Article non trouvé"
  }
  ```
- `500` : Erreur serveur

**⚠️ Important :**
- Le slug est généré automatiquement depuis le titre (minuscules, sans accents, avec tirets)
- Le compteur `views` est incrémenté à chaque requête GET
- Seuls les articles publiés sont accessibles

---

## 📁 Endpoints Catégories

### 1. Liste des catégories actives

**Endpoint :** `GET /api/categories`

**Description :** Récupère la liste de toutes les catégories actives avec le nombre d'articles publiés par catégorie.

**Exemple de requête :**
```javascript
GET /api/categories
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Finance",
      "slug": "finance",
      "description": "Articles sur la finance aérienne",
      "color": "#FF5733",
      "isActive": true,
      "articleCount": 12,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Infrastructure",
      "slug": "infrastructure",
      "description": "Articles sur les infrastructures aéroportuaires",
      "color": "#33C3F0",
      "isActive": true,
      "articleCount": 8,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Notes importantes :**
- ✅ Seules les catégories avec `isActive: true` sont retournées
- ✅ Les catégories sont triées par nom (ordre alphabétique)
- ✅ Le champ `articleCount` indique le nombre d'articles **publiés** dans cette catégorie
- ✅ Les catégories sans articles publiés ont `articleCount: 0`

---

### 2. Détails d'une catégorie par ID

**Endpoint :** `GET /api/categories/:id`

**Description :** Récupère les détails d'une catégorie par son ID MongoDB.

**Paramètres URL :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `id` | string | ID MongoDB de la catégorie |

**Exemple de requête :**
```javascript
GET /api/categories/507f1f77bcf86cd799439012
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Finance",
    "slug": "finance",
    "description": "Articles sur la finance aérienne",
    "color": "#FF5733",
    "isActive": true,
    "articleCount": 12,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Gestion des erreurs :**
- `404` : Catégorie non trouvée ou inactive
  ```json
  {
    "success": false,
    "message": "Catégorie non trouvée"
  }
  ```

---

## 📊 Structure des données

### Article

```typescript
interface Article {
  _id: string;                    // ID MongoDB
  title: string;                  // Titre (max 200 caractères)
  slug: string;                   // Slug unique (généré automatiquement)
  excerpt: string;                // Résumé (max 500 caractères)
  content: string;                // Contenu complet (HTML ou Markdown)
  category: {                     // Catégorie (populée)
    _id: string;
    name: string;
    slug: string;
    color: string;                // Couleur hexadécimale
    description?: string;         // Uniquement dans GET /articles/:slug
  };
  author: string;                 // Nom de l'auteur
  featuredImage: string;          // URL de l'image principale
  tags: string[];                 // Tableau de tags
  publishedAt: string;            // Date ISO de publication
  views: number;                  // Nombre de vues
  status: "published";            // Toujours "published" (API publique)
  createdAt: string;              // Date ISO de création
  updatedAt: string;              // Date ISO de mise à jour
}
```

### Category

```typescript
interface Category {
  _id: string;                   // ID MongoDB
  name: string;                   // Nom (max 100 caractères)
  slug: string;                   // Slug unique (généré automatiquement)
  description?: string;           // Description (max 500 caractères)
  color: string;                  // Couleur hexadécimale (ex: "#FF5733")
  isActive: boolean;             // Toujours true (API publique)
  articleCount: number;          // Nombre d'articles publiés
  createdAt: string;             // Date ISO de création
  updatedAt: string;             // Date ISO de mise à jour
}
```

---

## 🔄 Pagination

### Format de réponse paginée

Toutes les listes paginées suivent ce format :

```typescript
{
  success: true;
  count: number;        // Nombre d'éléments dans la page actuelle
  total: number;        // Nombre total d'éléments
  page: number;         // Page actuelle
  pages: number;        // Nombre total de pages
  data: any[];          // Tableau de données
}
```

### Exemple d'utilisation

```javascript
// Page 1, 10 éléments par page
GET /api/articles?page=1&limit=10

// Réponse
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}

// Page 2
GET /api/articles?page=2&limit=10

// Réponse
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 2,
  "pages": 5,
  "data": [...]
}
```

---

## 🔍 Recherche et filtres

### Recherche textuelle

La recherche est insensible à la casse et cherche dans :
- `title` (titre)
- `content` (contenu)
- `excerpt` (résumé)
- `tags` (tags)

**Exemple :**
```javascript
GET /api/articles?search=ethiopie
```

Retourne tous les articles contenant "ethiopie" dans le titre, contenu, résumé ou tags.

### Filtre par catégorie

Le filtre `category` accepte :
- **Slug de catégorie** (recommandé) : `finance`, `infrastructure`
- **ID MongoDB** : `507f1f77bcf86cd799439012`

**Exemple :**
```javascript
// Par slug (recommandé)
GET /api/articles?category=finance

// Par ID
GET /api/articles?category=507f1f77bcf86cd799439012
```

**⚠️ Important :** Si la catégorie n'existe pas, un tableau vide est retourné (pas d'erreur 404).

---

## ❌ Gestion des erreurs

### Format d'erreur standard

```typescript
{
  success: false;
  message: string;        // Message d'erreur
  error?: string;         // Code d'erreur (en production uniquement)
  stack?: string;         // Stack trace (développement uniquement)
  details?: string;       // Détails supplémentaires (développement uniquement)
}
```

### Codes d'erreur HTTP

| Code | Description | Exemple |
|------|-------------|---------|
| `200` | Succès | Requête réussie |
| `400` | Erreur de validation | Paramètres invalides |
| `404` | Ressource non trouvée | Article ou catégorie introuvable |
| `500` | Erreur serveur | Erreur interne du serveur |
| `503` | Service indisponible | Base de données inaccessible |

### Exemples d'erreurs

**404 - Article non trouvé :**
```json
{
  "success": false,
  "message": "Article non trouvé"
}
```

**404 - Catégorie non trouvée :**
```json
{
  "success": false,
  "message": "Catégorie non trouvée"
}
```

**500 - Erreur serveur :**
```json
{
  "success": false,
  "message": "Erreur serveur",
  "error": "SERVER_ERROR"
}
```

**503 - Base de données inaccessible :**
```json
{
  "success": false,
  "message": "Erreur de connexion à la base de données"
}
```

---

## 💻 Exemples d'utilisation (JavaScript/React)

### Fetch API

```javascript
// Liste des articles
const fetchArticles = async (page = 1, limit = 10, category = null, search = null) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  
  const response = await fetch(`http://localhost:5000/api/articles?${params}`);
  const data = await response.json();
  
  if (data.success) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

// Article par slug
const fetchArticleBySlug = async (slug) => {
  const response = await fetch(`http://localhost:5000/api/articles/${slug}`);
  const data = await response.json();
  
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
};

// Liste des catégories
const fetchCategories = async () => {
  const response = await fetch('http://localhost:5000/api/categories');
  const data = await response.json();
  
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
};
```

### Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Liste des articles
const fetchArticles = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/articles`, { params });
  return response.data;
};

// Article par slug
const fetchArticleBySlug = async (slug) => {
  const response = await axios.get(`${API_BASE_URL}/articles/${slug}`);
  return response.data.data;
};

// Liste des catégories
const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data.data;
};
```

### React Hook personnalisé

```javascript
import { useState, useEffect } from 'react';

const useArticles = (filters = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const response = await fetch(`http://localhost:5000/api/articles?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setArticles(data.data);
          setPagination({
            page: data.page,
            pages: data.pages,
            total: data.total,
            count: data.count
          });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [JSON.stringify(filters)]);

  return { articles, loading, error, pagination };
};
```

---

## 🎯 Bonnes pratiques

### 1. Gestion des erreurs

Toujours vérifier `success` avant d'utiliser les données :

```javascript
const response = await fetch('/api/articles');
const data = await response.json();

if (data.success) {
  // Utiliser data.data
} else {
  // Gérer l'erreur avec data.message
}
```

### 2. Pagination

Utiliser les métadonnées de pagination pour la navigation :

```javascript
const { page, pages, total, count } = pagination;

// Afficher "Page 1 sur 5 (50 articles)"
console.log(`Page ${page} sur ${pages} (${total} articles)`);

// Navigation
const nextPage = page < pages ? page + 1 : null;
const prevPage = page > 1 ? page - 1 : null;
```

### 3. Filtres par catégorie

Utiliser le slug plutôt que l'ID pour les URLs :

```javascript
// ✅ Bon
const url = `/articles?category=finance`;

// ❌ Moins bon
const url = `/articles?category=507f1f77bcf86cd799439012`;
```

### 4. Recherche

Débouncer les requêtes de recherche pour éviter trop de requêtes :

```javascript
import { useDebounce } from 'use-debounce';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch] = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchArticles({ search: debouncedSearch });
  }
}, [debouncedSearch]);
```

### 5. Gestion des vues

Le compteur de vues est incrémenté automatiquement. Ne pas faire de requête supplémentaire pour incrémenter les vues.

---

## 🔗 URLs et routing

### Structure recommandée

```
/articles                    → Liste des articles
/articles?category=finance    → Articles de la catégorie Finance
/articles?search=aviation     → Recherche "aviation"
/articles/:slug              → Détails d'un article
/categories                  → Liste des catégories (optionnel)
```

### Exemples de slugs

Les slugs sont générés automatiquement depuis les titres :
- `"Éthiopie 2025-2026"` → `"ethiopie-2025-2026"`
- `"L'aviation africaine"` → `"l-aviation-africaine"`
- `"Nouvelles normes de sécurité"` → `"nouvelles-normes-de-securite"`

---

## 📝 Notes importantes

1. **API publique uniquement** : Tous les endpoints sont publics, pas d'authentification requise
2. **Articles publiés uniquement** : Seuls les articles avec `status: "published"` sont accessibles (automatique)
3. **Catégories actives uniquement** : Seules les catégories avec `isActive: true` sont retournées
4. **Compteur de vues** : Incrémenté automatiquement à chaque GET `/api/articles/:slug`
5. **Pagination** : Par défaut, 10 éléments par page (modifiable avec `limit`)
6. **Tri** : Articles triés par `publishedAt` décroissant (plus récent en premier)
7. **Recherche** : Insensible à la casse, cherche dans titre, contenu, résumé et tags
8. **Catégorie inexistante** : Retourne un tableau vide (pas d'erreur 404)

---

## 🚀 Prochaines étapes

1. Configurer la base URL selon l'environnement (dev/prod)
2. Implémenter la gestion d'erreurs globale
3. Ajouter le loading state pour toutes les requêtes
4. Implémenter la pagination dans l'UI
5. Ajouter la recherche avec debounce
6. Gérer les cas où aucune donnée n'est disponible

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2026-01-08


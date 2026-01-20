# 📚 Guide : Ajout des Sources dans les Articles

## 🎯 Objectif
Ajouter un champ `sources` aux articles pour référencer les sources d'information utilisées.

## 📋 Structure proposée

### Format recommandé : Tableau d'objets
```json
{
  "sources": [
    {
      "title": "Nom de la source",
      "url": "https://example.com/article"
    },
    {
      "title": "Autre source",
      "url": "https://example.com/news"
    }
  ]
}
```

### Format alternatif : Tableau de strings (si plus simple)
```json
{
  "sources": [
    "https://example.com/article",
    "https://example.com/news"
  ]
}
```

## 🔧 Instructions Backend (MongoDB)

### Option 1 : Ajouter le champ lors de la création d'un article

```javascript
// Dans votre modèle Article (schema)
{
  // ... autres champs
  sources: [{
    title: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: true
    }
  }]
}
```

### Option 2 : Ajouter le champ à un article existant

```javascript
// Dans MongoDB Compass ou MongoDB Shell
db.articles.updateOne(
  { slug: "votre-slug-article" },
  {
    $set: {
      sources: [
        {
          title: "Nom de la source",
          url: "https://example.com/article"
        },
        {
          title: "Autre source",
          url: "https://example.com/news"
        }
      ]
    }
  }
)
```

### Option 3 : Ajouter via l'API (si endpoint existe)

```javascript
// PUT /api/articles/:slug
{
  "sources": [
    {
      "title": "Nom de la source",
      "url": "https://example.com/article"
    }
  ]
}
```

## 📝 Exemple complet d'article avec sources

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Titre de l'article",
  "slug": "titre-de-l-article",
  "excerpt": "Résumé court...",
  "content": "Contenu complet...",
  "category": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Finance",
    "slug": "finance",
    "color": "#FF5733"
  },
  "author": "Admin XC Afrique",
  "featuredImage": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "sources": [
    {
      "title": "Article de référence",
      "url": "https://example.com/reference"
    },
    {
      "title": "Source officielle",
      "url": "https://official.com/news"
    }
  ],
  "publishedAt": "2026-01-08T10:00:00.000Z",
  "views": 42,
  "status": "published",
  "createdAt": "2026-01-08T10:00:00.000Z",
  "updatedAt": "2026-01-08T10:00:00.000Z"
}
```

## ✅ Points importants

1. **Champ optionnel** : Le champ `sources` est optionnel. Si absent, rien ne s'affichera.
2. **Format flexible** : Le frontend supportera les deux formats (tableau d'objets ou tableau de strings).
3. **Validation** : Assurez-vous que les URLs sont valides.
4. **Ordre** : Les sources seront affichées dans l'ordre du tableau.

## 🔄 Mise à jour de la documentation API

Ajoutez dans votre documentation API :

```typescript
interface Article {
  // ... autres champs
  sources?: Array<{
    title?: string;
    url: string;
  }> | string[];
}
```


# 📝 Guide : Comment publier un article

Ce guide explique comment publier un article qui existe déjà dans le backend mais qui n'est pas encore visible sur le frontend.

## ⚠️ Prérequis

Pour qu'un article apparaisse dans le frontend, il doit avoir :
- ✅ `status: "published"` (et non `"draft"`)
- ✅ `publishedAt` : une date de publication définie (format ISO)

---

## 🔧 Méthode 1 : Via l'API d'administration (si disponible)

Si votre backend a une API d'administration, vous pouvez publier un article avec une requête PUT/PATCH.

### Exemple avec curl

```bash
# Publier un article par son ID
curl -X PATCH https://xcafrique-backend.vercel.app/api/admin/articles/[ARTICLE_ID] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [VOTRE_TOKEN]" \
  -d '{
    "status": "published",
    "publishedAt": "2025-01-15T10:00:00.000Z"
  }'
```

### Exemple avec JavaScript/Fetch

```javascript
const publishArticle = async (articleId, token) => {
  try {
    const response = await fetch(
      `https://xcafrique-backend.vercel.app/api/admin/articles/${articleId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'published',
          publishedAt: new Date().toISOString()
        })
      }
    )
    
    const data = await response.json()
    if (data.success) {
      console.log('Article publié avec succès!')
      return data.data
    } else {
      console.error('Erreur:', data.message)
    }
  } catch (error) {
    console.error('Erreur réseau:', error)
  }
}

// Utilisation
publishArticle('507f1f77bcf86cd799439011', 'votre-token-jwt')
```

### Exemple avec Axios (dans le frontend)

```javascript
import API from './api'

const publishArticle = async (articleId) => {
  try {
    const response = await API.patch(`/admin/articles/${articleId}`, {
      status: 'published',
      publishedAt: new Date().toISOString()
    })
    
    if (response.data.success) {
      console.log('Article publié!', response.data.data)
      return response.data.data
    }
  } catch (error) {
    console.error('Erreur:', error.response?.data?.message || error.message)
  }
}
```

---

## 🗄️ Méthode 2 : Directement dans MongoDB

Si vous avez accès à MongoDB (via MongoDB Compass, MongoDB Atlas, ou mongo shell), vous pouvez modifier l'article directement.

### Avec MongoDB Compass ou MongoDB Atlas

1. Connectez-vous à votre base de données MongoDB
2. Trouvez la collection `articles` (ou le nom de votre collection)
3. Recherchez l'article par son `_id` ou son `slug`
4. Modifiez les champs suivants :
   - `status` : Changez de `"draft"` à `"published"`
   - `publishedAt` : Ajoutez une date (ex: `2025-01-15T10:00:00.000Z`)
5. Sauvegardez

### Avec mongo shell

```javascript
// Se connecter à MongoDB
use xcafrique  // Remplacez par le nom de votre base de données

// Trouver l'article par slug
db.articles.findOne({ slug: "votre-slug-article" })

// Publier l'article par ID
db.articles.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    $set: {
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date()
    }
  }
)

// Ou publier par slug
db.articles.updateOne(
  { slug: "votre-slug-article" },
  {
    $set: {
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date()
    }
  }
)

// Publier plusieurs articles en brouillon
db.articles.updateMany(
  { status: "draft" },
  {
    $set: {
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date()
    }
  }
)
```

### Avec MongoDB Atlas (Interface Web)

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Connectez-vous et sélectionnez votre cluster
3. Cliquez sur "Browse Collections"
4. Trouvez votre collection `articles`
5. Recherchez l'article et cliquez sur "Edit"
6. Modifiez :
   - `status`: `"published"`
   - `publishedAt`: `"2025-01-15T10:00:00.000Z"`
7. Cliquez sur "Update"

---

## 📜 Méthode 3 : Via un script Node.js

Créez un script pour publier un ou plusieurs articles.

### Script de publication

Créez un fichier `scripts/publishArticle.js` dans votre backend :

```javascript
const mongoose = require('mongoose')
const Article = require('./models/Article') // Ajustez le chemin

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xcafrique'

async function publishArticle(slugOrId) {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté à MongoDB')

    // Trouver l'article
    let article
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      // Si c'est un ID MongoDB
      article = await Article.findById(slugOrId)
    } else {
      // Si c'est un slug
      article = await Article.findOne({ slug: slugOrId })
    }

    if (!article) {
      console.error('❌ Article non trouvé:', slugOrId)
      process.exit(1)
    }

    // Vérifier si déjà publié
    if (article.status === 'published') {
      console.log('ℹ️  L\'article est déjà publié:', article.title)
      process.exit(0)
    }

    // Publier l'article
    article.status = 'published'
    article.publishedAt = new Date()
    article.updatedAt = new Date()

    await article.save()

    console.log('✅ Article publié avec succès!')
    console.log('📄 Titre:', article.title)
    console.log('🔗 Slug:', article.slug)
    console.log('📅 Date de publication:', article.publishedAt)

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

// Utilisation : node scripts/publishArticle.js [slug-ou-id]
const slugOrId = process.argv[2]
if (!slugOrId) {
  console.error('❌ Usage: node scripts/publishArticle.js [slug-ou-id]')
  process.exit(1)
}

publishArticle(slugOrId)
```

### Exécuter le script

```bash
# Publier par slug
node scripts/publishArticle.js "brussels-airlines-valorise-la-richesse-culinaire-africaine"

# Publier par ID
node scripts/publishArticle.js "507f1f77bcf86cd799439011"
```

### Script pour publier tous les brouillons

```javascript
const mongoose = require('mongoose')
const Article = require('./models/Article')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xcafrique'

async function publishAllDrafts() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté à MongoDB')

    const result = await Article.updateMany(
      { status: 'draft' },
      {
        $set: {
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date()
        }
      }
    )

    console.log(`✅ ${result.modifiedCount} article(s) publié(s)`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

publishAllDrafts()
```

---

## 🔍 Vérifier qu'un article est publié

### Via l'API

```bash
# Vérifier si l'article apparaît dans la liste
curl https://xcafrique-backend.vercel.app/api/articles

# Vérifier un article spécifique par slug
curl https://xcafrique-backend.vercel.app/api/articles/votre-slug-article
```

### Via MongoDB

```javascript
// Vérifier le statut d'un article
db.articles.findOne(
  { slug: "votre-slug-article" },
  { status: 1, publishedAt: 1, title: 1 }
)
```

---

## 📋 Checklist de publication

Avant de publier, vérifiez que l'article a :

- [ ] ✅ Un `title` (titre)
- [ ] ✅ Un `slug` unique (généré automatiquement normalement)
- [ ] ✅ Un `content` (contenu)
- [ ] ✅ Un `excerpt` (résumé)
- [ ] ✅ Une `category` valide (référence à une catégorie existante)
- [ ] ✅ Un `author` (auteur)
- [ ] ✅ Une `featuredImage` (image principale, optionnel mais recommandé)
- [ ] ✅ `status: "published"` (statut publié)
- [ ] ✅ `publishedAt` : une date définie

---

## 🐛 Dépannage

### L'article n'apparaît toujours pas après publication

1. **Vérifiez le statut dans MongoDB** :
   ```javascript
   db.articles.findOne({ slug: "votre-slug" }, { status: 1, publishedAt: 1 })
   ```

2. **Vérifiez que la catégorie est active** :
   ```javascript
   db.categories.findOne({ _id: ObjectId("...") }, { isActive: 1 })
   ```

3. **Vérifiez les logs du backend** pour des erreurs

4. **Videz le cache du navigateur** (Ctrl+Shift+R ou Cmd+Shift+R)

5. **Vérifiez l'URL de l'API** dans les variables d'environnement

### Erreur "Article non trouvé"

- Vérifiez que le slug est exact (sensible à la casse)
- Vérifiez que l'article existe dans MongoDB
- Vérifiez que vous utilisez le bon ID MongoDB

### Erreur 404 pour une catégorie (ex: `passagers-service`)

Si vous voyez une erreur `404 (Not Found)` lors de la récupération des articles d'une catégorie :

1. **Vérifiez que la catégorie existe** :
   ```bash
   curl https://xcafrique-backend.vercel.app/api/categories
   ```

2. **Vérifiez le slug exact de la catégorie** :
   - Le slug doit correspondre exactement (sensible à la casse)
   - Les espaces sont remplacés par des tirets
   - Les caractères spéciaux sont normalisés

3. **Vérifiez dans MongoDB** :
   ```javascript
   // Lister toutes les catégories
   db.categories.find({}, { name: 1, slug: 1, isActive: 1 })
   
   // Chercher une catégorie spécifique
   db.categories.findOne({ slug: "passagers-service" })
   ```

4. **Solutions possibles** :
   - Si la catégorie n'existe pas : créez-la dans MongoDB
   - Si le slug est incorrect : corrigez-le dans MongoDB ou utilisez le bon slug
   - Si la catégorie existe mais n'a pas d'articles : c'est normal, le frontend affichera "Aucun article trouvé"

5. **Note** : Le frontend gère maintenant les erreurs 404 pour les catégories et affiche un message approprié au lieu d'une erreur générique.

---

## 💡 Astuces

### Publier avec une date de publication future

```javascript
// Dans MongoDB
db.articles.updateOne(
  { slug: "votre-slug" },
  {
    $set: {
      status: "published",
      publishedAt: ISODate("2025-02-01T10:00:00.000Z"), // Date future
      updatedAt: new Date()
    }
  }
)
```

### Repasser un article en brouillon

```javascript
db.articles.updateOne(
  { slug: "votre-slug" },
  {
    $set: {
      status: "draft",
      updatedAt: new Date()
    }
  }
)
```

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend (Vercel Dashboard)
2. Testez les endpoints directement avec curl ou Postman
3. Vérifiez que MongoDB est accessible
4. Contactez l'équipe backend avec les détails de l'erreur

---

**Dernière mise à jour :** Janvier 2025


# 🔧 Guide : Résoudre le problème des sources en production

## 🔍 Diagnostic

Le problème peut venir de deux choses :
1. **Le code frontend n'est pas déployé** avec les modifications
2. **Les articles en production n'ont pas de sources** dans MongoDB

## ✅ Solution 1 : Déployer le code frontend

### Étape 1 : Pousser les changements vers GitHub

```bash
git push origin main
```

### Étape 2 : Vercel déploiera automatiquement

Si votre projet est connecté à Vercel, le déploiement se fera automatiquement.

### Étape 3 : Vérifier le déploiement

1. Allez sur https://vercel.com
2. Vérifiez que le dernier déploiement est terminé
3. Si nécessaire, videz le cache et redéployez

## ✅ Solution 2 : Ajouter des sources aux articles en production

### Option A : Via MongoDB Compass (recommandé)

1. **Connectez-vous à MongoDB Compass** avec cette URI :
   ```
   mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique
   ```

2. **Sélectionnez la base de données** `XCAfrique`

3. **Ouvrez la collection** `articles`

4. **Trouvez un article** et cliquez sur "Edit Document"

5. **Ajoutez le champ `sources`** :
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

6. **Sauvegardez** le document

### Option B : Via MongoDB Shell

```javascript
// Se connecter à MongoDB
mongosh "mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique"

// Vérifier les articles
db.articles.find({ status: "published" }).forEach(article => {
  print(`Article: ${article.title} (slug: ${article.slug})`)
  if (article.sources) {
    print(`  Sources: ${JSON.stringify(article.sources)}`)
  } else {
    print(`  Sources: ❌ Aucune`)
  }
})

// Ajouter des sources à un article spécifique
db.articles.updateOne(
  { slug: "votre-slug-article" },
  {
    $set: {
      sources: [
        {
          title: "Source officielle",
          url: "https://example.com/official"
        },
        {
          title: "Article de référence",
          url: "https://example.com/reference"
        }
      ],
      updatedAt: new Date()
    }
  }
)

// Vérifier que les sources ont été ajoutées
db.articles.findOne({ slug: "votre-slug-article" })
```

### Option C : Via l'API Backend (si endpoint existe)

```javascript
// PUT /api/articles/:slug
fetch('https://xcafrique-backend.vercel.app/api/articles/votre-slug', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN' // Si requis
  },
  body: JSON.stringify({
    sources: [
      {
        title: "Source officielle",
        url: "https://example.com/official"
      }
    ]
  })
})
```

## 🧪 Vérification

### 1. Vérifier que le code frontend est déployé

1. Ouvrez votre site en production
2. Ouvrez la console du navigateur (F12)
3. Allez sur la page de détail d'un article
4. Vérifiez dans le code source que la section "Sources" existe

### 2. Vérifier que les articles ont des sources

```javascript
// Dans MongoDB Shell ou Compass
db.articles.findOne({ slug: "votre-slug" })
// Vérifiez que le champ "sources" existe et contient des données
```

### 3. Tester l'affichage

1. Visitez un article avec des sources en production
2. Les sources devraient apparaître après le contenu de l'article
3. Les liens devraient être cliquables et s'ouvrir dans un nouvel onglet

## 🔍 Debugging

### Si les sources ne s'affichent pas :

1. **Vérifiez la console du navigateur** pour des erreurs JavaScript
2. **Vérifiez les données de l'article** dans l'onglet Network :
   - Ouvrez DevTools (F12)
   - Onglet Network
   - Rechargez la page
   - Trouvez la requête vers `/api/articles/:slug`
   - Vérifiez la réponse JSON : est-ce que `sources` existe ?

3. **Vérifiez le format des sources** :
   ```json
   // ✅ Format correct
   {
     "sources": [
       { "title": "Source", "url": "https://..." }
     ]
   }
   
   // ✅ Format alternatif correct
   {
     "sources": [
       "https://example.com"
     ]
   }
   
   // ❌ Format incorrect
   {
     "sources": "https://example.com"  // Doit être un tableau
   }
   ```

## 📝 Exemple complet

```javascript
// Dans MongoDB Compass ou Shell
db.articles.updateOne(
  { slug: "ethiopie-2025-2026-ethiopian-airlines" },
  {
    $set: {
      sources: [
        {
          title: "Site officiel Ethiopian Airlines",
          url: "https://www.ethiopianairlines.com"
        },
        {
          title: "Article de référence",
          url: "https://example.com/reference"
        }
      ],
      updatedAt: new Date()
    }
  }
)
```

Puis visitez : `https://votre-site.vercel.app/article/ethiopie-2025-2026-ethiopian-airlines`

Les sources devraient s'afficher automatiquement ! 🎉


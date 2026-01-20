# ⚡ Guide Rapide : Ajouter des sources aux articles en production

## 🎯 Problème
Les sources ne s'affichent pas en production car :
1. ✅ Le code frontend est maintenant déployé (après le push)
2. ⏳ Il faut ajouter des sources aux articles dans MongoDB

## 🚀 Solution Rapide

### Option 1 : MongoDB Compass (le plus simple)

1. **Téléchargez MongoDB Compass** : https://www.mongodb.com/try/download/compass

2. **Connectez-vous** avec cette URI :
   ```
   mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique
   ```

3. **Sélectionnez** la base `XCAfrique` → collection `articles`

4. **Trouvez un article** et cliquez sur "Edit Document"

5. **Ajoutez ce champ** (cliquez sur "+" pour ajouter un champ) :
   ```json
   "sources": [
     {
       "title": "Nom de la source",
       "url": "https://example.com/article"
     }
   ]
   ```

6. **Sauvegardez** (Ctrl+S ou bouton "Update")

### Option 2 : MongoDB Shell (ligne de commande)

```bash
# Se connecter
mongosh "mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique"

# Lister les articles
db.articles.find({ status: "published" }).forEach(a => print(a.slug + " - " + a.title))

# Ajouter des sources à un article
db.articles.updateOne(
  { slug: "VOTRE-SLUG-ICI" },
  {
    $set: {
      sources: [
        { title: "Source 1", url: "https://example.com/1" },
        { title: "Source 2", url: "https://example.com/2" }
      ],
      updatedAt: new Date()
    }
  }
)

# Vérifier
db.articles.findOne({ slug: "VOTRE-SLUG-ICI" })
```

### Option 3 : Via le navigateur (MongoDB Atlas)

1. Allez sur https://cloud.mongodb.com
2. Connectez-vous
3. Sélectionnez votre cluster
4. Cliquez sur "Browse Collections"
5. Base : `XCAfrique` → Collection : `articles`
6. Trouvez un article et cliquez dessus
7. Cliquez sur "Edit Document"
8. Ajoutez le champ `sources` comme dans l'Option 1

## 📋 Format des sources

```json
{
  "sources": [
    {
      "title": "Nom de la source (optionnel)",
      "url": "https://example.com/article"
    }
  ]
}
```

**OU** format simple (juste l'URL) :
```json
{
  "sources": [
    "https://example.com/article"
  ]
}
```

## ✅ Vérification

1. **Attendez 1-2 minutes** pour que Vercel redéploie (si vous venez de pousser le code)
2. **Rechargez votre site en production**
3. **Visitez un article** avec des sources ajoutées
4. **Les sources devraient apparaître** après le contenu de l'article

## 🔍 Si ça ne marche toujours pas

1. **Vérifiez dans la console du navigateur** (F12) :
   - Ouvrez l'onglet Network
   - Rechargez la page de l'article
   - Trouvez la requête vers `/api/articles/:slug`
   - Vérifiez la réponse : est-ce que `sources` existe ?

2. **Vérifiez le format** :
   - `sources` doit être un **tableau** (array)
   - Pas une string, pas un objet unique

3. **Videz le cache du navigateur** :
   - Ctrl+Shift+Delete
   - Cochez "Images et fichiers en cache"
   - Rechargez la page

## 📝 Exemple concret

Pour un article avec le slug `"mon-article"` :

```javascript
db.articles.updateOne(
  { slug: "mon-article" },
  {
    $set: {
      sources: [
        {
          title: "Site officiel",
          url: "https://www.example.com/official"
        },
        {
          title: "Article de presse",
          url: "https://www.press.com/article"
        }
      ],
      updatedAt: new Date()
    }
  }
)
```

Puis visitez : `https://votre-site.vercel.app/article/mon-article`

Les sources apparaîtront automatiquement ! 🎉


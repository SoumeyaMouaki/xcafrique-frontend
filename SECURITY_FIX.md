# 🔒 Correction des secrets exposés

## ✅ Actions effectuées

Les secrets MongoDB hardcodés ont été supprimés des fichiers suivants :

1. **scripts/updateCategoryColors.js**
2. **scripts/checkAndAddSources.js**
3. **scripts/addSourcesToArticle.js**
4. **scripts/updateAllCategoryColorsMongoDB.js**

### Changements apportés

- ❌ **Avant** : Les scripts contenaient des credentials MongoDB en dur
  ```javascript
  const MONGODB_URI = process.env.MONGODB_URI_PROD || 'mongodb+srv://user:password@...'
  ```

- ✅ **Après** : Les scripts exigent maintenant une variable d'environnement obligatoire
  ```javascript
  const MONGODB_URI = process.env.MONGODB_URI_PROD
  
  if (!MONGODB_URI) {
    console.error('❌ Erreur: La variable d\'environnement MONGODB_URI_PROD est requise')
    process.exit(1)
  }
  ```

## ⚠️  Action requise : Rotation des secrets

**IMPORTANT** : Les secrets qui ont été commités dans l'historique Git sont toujours visibles dans les commits précédents. Pour sécuriser complètement votre projet :

### 1. Changer le mot de passe MongoDB

1. Connectez-vous à MongoDB Atlas
2. Allez dans **Database Access** → **Database Users**
3. Trouvez l'utilisateur `dawini-user`
4. Cliquez sur **Edit** → **Edit Password**
5. Générez un nouveau mot de passe sécurisé
6. Mettez à jour la variable d'environnement `MONGODB_URI_PROD` partout où elle est utilisée

### 2. Mettre à jour les variables d'environnement

- **Vercel** : Allez dans votre projet → Settings → Environment Variables
- **Local** : Mettez à jour votre fichier `.env` local (non commité)

### 3. Utiliser les scripts

Désormais, pour utiliser les scripts MongoDB, vous devez définir la variable d'environnement :

**Sur Windows (PowerShell)** :
```powershell
$env:MONGODB_URI_PROD="mongodb+srv://user:password@cluster.mongodb.net/XCAfrique"
node scripts/updateCategoryColors.js
```

**Sur Linux/Mac** :
```bash
export MONGODB_URI_PROD="mongodb+srv://user:password@cluster.mongodb.net/XCAfrique"
node scripts/updateCategoryColors.js
```

## 📋 Vérification

Pour vérifier qu'aucun secret n'est exposé dans le code actuel :

```bash
# Rechercher des patterns de secrets
grep -r "mongodb+srv://" --exclude-dir=node_modules --exclude-dir=.git
grep -r "password.*=" --exclude-dir=node_modules --exclude-dir=.git
```

## 🔐 Bonnes pratiques

1. ✅ **Utiliser des variables d'environnement** pour tous les secrets
2. ✅ **Ne jamais commiter** de fichiers `.env` avec des valeurs réelles
3. ✅ **Utiliser GitHub Secrets** pour les workflows CI/CD
4. ✅ **Utiliser Vercel Environment Variables** pour la production
5. ✅ **Rotater les secrets** régulièrement, surtout après une exposition

## 📝 Fichiers sécurisés

- ✅ `.gitignore` : Configure correctement pour ignorer les fichiers `.env*`
- ✅ Scripts : N'utilisent plus de valeurs par défaut hardcodées
- ✅ Code source : Aucun secret visible dans le code actuel

---

**Date de correction** : $(date)
**Commit** : `a716b63` - security: Remove hardcoded MongoDB credentials from scripts


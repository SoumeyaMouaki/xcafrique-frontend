# 🚀 Guide : Déploiement sur Vercel - Correction categoryColor

## ✅ Problème résolu
L'erreur `ReferenceError: categoryColor is not defined` a été corrigée dans tous les fichiers source.

## 📋 Étapes pour déployer la correction sur Vercel

### Option 1 : Déploiement automatique (recommandé)
Si votre projet est connecté à Vercel avec Git, suivez ces étapes :

1. **Commiter et pousser les changements :**
   ```bash
   git add .
   git commit -m "fix: Correction erreur categoryColor is not defined"
   git push origin main
   ```

2. **Vercel déploiera automatiquement** après le push.

3. **Vider le cache de Vercel (si nécessaire) :**
   - Allez sur https://vercel.com
   - Ouvrez votre projet
   - Allez dans **Settings** → **General**
   - Cliquez sur **Clear Build Cache**
   - Redéployez manuellement

### Option 2 : Déploiement manuel depuis Vercel Dashboard

1. **Allez sur https://vercel.com**
2. **Ouvrez votre projet**
3. **Cliquez sur l'onglet "Deployments"**
4. **Cliquez sur les trois points (⋯) du dernier déploiement**
5. **Sélectionnez "Redeploy"**
6. **Cochez "Use existing Build Cache"** → **Décochez-le** (pour forcer un nouveau build)
7. **Cliquez sur "Redeploy"**

### Option 3 : Via Vercel CLI

```bash
# Installer Vercel CLI (si pas déjà installé)
npm i -g vercel

# Se connecter
vercel login

# Déployer avec cache vidé
vercel --prod --force
```

## 🔍 Vérification après déploiement

1. **Attendez la fin du déploiement** (généralement 2-5 minutes)
2. **Ouvrez votre site en production**
3. **Ouvrez la console du navigateur (F12)**
4. **Vérifiez qu'il n'y a plus d'erreur `categoryColor is not defined`**
5. **Testez en cliquant sur un article** pour vérifier que la page de détail fonctionne

## ⚠️ Si le problème persiste

1. **Vérifiez que tous les fichiers sont bien commités :**
   ```bash
   git status
   ```

2. **Vérifiez que le build local fonctionne :**
   ```bash
   npm run build
   ```

3. **Vérifiez les logs de déploiement sur Vercel :**
   - Allez dans **Deployments** → Cliquez sur le dernier déploiement
   - Vérifiez les logs de build pour voir s'il y a des erreurs

4. **Videz complètement le cache :**
   - Dans Vercel Dashboard → Settings → General
   - Cliquez sur **Clear Build Cache**
   - Redéployez

## 📝 Fichiers modifiés pour cette correction

- `src/components/ArticleCard.jsx`
- `src/components/NewsSection.jsx`
- `src/pages/ArticleDetail.jsx`
- `src/services/articles.js`
- `src/components/CategoryList.jsx`

Tous ces fichiers utilisent maintenant directement `article.category?.color || '#default'` au lieu de la variable `categoryColor`.


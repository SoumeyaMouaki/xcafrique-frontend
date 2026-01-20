# ⚠️ Erreur Frontend : `categoryColor is not defined`

## 🔍 Problème

Le code frontend essaie d'utiliser une variable `categoryColor` qui n'existe pas, causant l'erreur :
```
ReferenceError: categoryColor is not defined
```

### Cause

Le code définit une variable `categoryColor` mais essaie de l'utiliser dans un scope où elle n'est pas accessible, ou la variable n'est pas définie avant d'être utilisée.

---

## ✅ Solution

**Remplacer toutes les occurrences de `categoryColor` par `article.category?.color || '#007bff'` directement dans les attributs `style`.**

### Principe

Au lieu de créer une variable intermédiaire `categoryColor`, accéder directement à la couleur depuis l'objet `article.category.color` dans les attributs `style`.

---

## 📝 Exemples de Correction

### ❌ Avant (Incorrect)

```javascript
// Définition de la variable
const categoryColor = article.category?.color || '#007bff'

// Utilisation dans le style
<span style={{ backgroundColor: categoryColor }}>
  {article.category?.name}
</span>
```

**Problème :** Si `categoryColor` n'est pas défini dans le bon scope, cela cause une erreur.

### ✅ Après (Correct)

```javascript
// Pas besoin de variable intermédiaire
// Utilisation directe dans le style
<span style={{ backgroundColor: article.category?.color || '#007bff' }}>
  {article.category?.name}
</span>
```

**Avantage :** Accès direct à la propriété, pas de problème de scope.

---

## 🔧 Corrections par Fichier

### 1. `src/components/NewsSection.jsx`

**❌ Avant :**
```javascript
{articles.map((article, index) => {
  const categoryColor = article?.category?.color || '#EA580C'
  
  return (
    <span style={{ backgroundColor: categoryColor }}>
      {categoryName}
    </span>
  )
})}
```

**✅ Après :**
```javascript
{articles.map((article, index) => {
  return (
    <span style={{ backgroundColor: article.category?.color || '#EA580C' }}>
      {categoryName}
    </span>
  )
})}
```

---

### 2. `src/pages/ArticleDetail.jsx`

**❌ Avant :**
```javascript
const categoryColor = article?.category?.color || '#1E40AF'

return (
  <span style={{ backgroundColor: categoryColor }}>
    {categoryName}
  </span>
)
```

**✅ Après :**
```javascript
return (
  <span style={{ backgroundColor: article.category?.color || '#1E40AF' }}>
    {categoryName}
  </span>
)
```

---

### 3. `src/components/ArticleCard.jsx`

**❌ Avant :**
```javascript
const categoryColor = article?.category?.color || '#1E40AF'

return (
  <span style={{ backgroundColor: categoryColor }}>
    {categoryName}
  </span>
)
```

**✅ Après :**
```javascript
return (
  <span style={{ backgroundColor: article.category?.color || '#1E40AF' }}>
    {categoryName}
  </span>
)
```

---

### 4. `src/components/CategoryList.jsx`

**Note :** Pour `CategoryList`, on utilise `category.color` directement (pas `article.category.color`).

**❌ Avant :**
```javascript
const categoryColor = category.color || '#6B7280'

return (
  <span style={{ color: categoryColor }}>
    {categoryName}
  </span>
)
```

**✅ Après :**
```javascript
return (
  <span style={{ color: category.color || '#6B7280' }}>
    {categoryName}
  </span>
)
```

---

## 📋 Checklist de Correction

Pour chaque fichier concerné, vérifier :

- [ ] Supprimer la déclaration `const categoryColor = ...`
- [ ] Remplacer `categoryColor` par `article.category?.color || '#couleur-par-defaut'` dans les `style`
- [ ] Pour `CategoryList.jsx`, utiliser `category.color || '#couleur-par-defaut'`
- [ ] Vérifier que toutes les occurrences sont remplacées
- [ ] Tester que l'application fonctionne sans erreur

---

## 🎨 Couleurs par Défaut Utilisées

| Fichier | Couleur par défaut | Usage |
|---------|-------------------|-------|
| `NewsSection.jsx` | `#EA580C` (accent-orange) | Badge catégorie |
| `ArticleDetail.jsx` | `#1E40AF` (primary-dark) | Badge catégorie |
| `ArticleCard.jsx` | `#1E40AF` (primary-dark) | Badge catégorie |
| `CategoryList.jsx` | `#6B7280` (gray) | Bordure et texte |

---

## 🔍 Recherche des Occurrences

Pour trouver toutes les occurrences de `categoryColor` dans le projet :

```bash
# Avec grep
grep -r "categoryColor" src/

# Ou avec ripgrep
rg "categoryColor" src/
```

---

## ✅ Vérification Post-Correction

### 1. Vérifier qu'il n'y a plus d'occurrences

```bash
grep -r "categoryColor" src/
# Ne devrait rien retourner
```

### 2. Vérifier que le code compile

```bash
npm run build
# Ou
npm run dev
```

### 3. Tester dans le navigateur

1. Ouvrir la console du navigateur (F12)
2. Vérifier qu'il n'y a plus d'erreur `categoryColor is not defined`
3. Vérifier que les couleurs de catégorie s'affichent correctement

---

## 📚 Structure de l'Objet Category

L'API retourne toujours la catégorie avec ces champs :

```typescript
{
  _id: string;
  name: string;
  slug: string;
  color: string;        // Toujours présent (défaut: '#007bff')
  description?: string; // Optionnel
}
```

### Accès à la couleur

```javascript
// ✅ CORRECT : Accès direct avec optional chaining
article.category?.color || '#007bff'

// ✅ CORRECT : Pour les catégories (pas dans un article)
category.color || '#6B7280'

// ❌ INCORRECT : Variable intermédiaire
const categoryColor = article.category?.color // Peut causer des problèmes de scope
```

---

## 🐛 Dépannage

### Erreur persiste après correction

1. **Vider le cache du navigateur** (Ctrl+Shift+R ou Cmd+Shift+R)
2. **Redémarrer le serveur de développement**
3. **Rebuild le projet** : `npm run build`
4. **Vérifier les fichiers compilés** dans `dist/` ou `.next/`

### La couleur ne s'affiche pas

1. Vérifier que `article.category` existe
2. Vérifier que `article.category.color` contient une valeur
3. Tester dans la console :
   ```javascript
   console.log('Category:', article.category)
   console.log('Color:', article.category?.color)
   ```

---

## 📝 Notes Importantes

1. ✅ **Toujours utiliser l'optional chaining** : `article.category?.color`
2. ✅ **Toujours fournir une valeur par défaut** : `|| '#007bff'`
3. ✅ **Utiliser directement dans les styles** : Pas besoin de variable intermédiaire
4. ✅ **Pour CategoryList** : Utiliser `category.color` (pas `article.category.color`)

---

## 🔗 Fichiers Concernés

- ✅ `src/components/NewsSection.jsx` - Corrigé
- ✅ `src/pages/ArticleDetail.jsx` - Corrigé
- ✅ `src/components/ArticleCard.jsx` - Corrigé
- ✅ `src/components/CategoryList.jsx` - Corrigé

---

## 📞 Support

Si l'erreur persiste après avoir appliqué ces corrections :

1. Vérifier les logs de la console du navigateur
2. Vérifier que tous les fichiers ont été sauvegardés
3. Vérifier que le build est à jour
4. Consulter `GUIDE_CATEGORY_COLOR.md` pour plus de détails

---

**Dernière mise à jour :** Janvier 2025  
**Version :** 1.0.0


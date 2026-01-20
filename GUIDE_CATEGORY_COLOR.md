# 🎨 Guide : Utilisation de la Couleur de Catégorie

## ⚠️ Erreur Courante : `categoryColor is not defined`

### 🔍 Problème

Le frontend essaie d'accéder à une variable `categoryColor` qui n'existe pas, causant l'erreur :
```
ReferenceError: categoryColor is not defined
```

## ✅ Solution

### Accès correct à la couleur de catégorie

La couleur de catégorie est disponible dans `article.category.color`, pas dans une variable séparée `categoryColor`.

**❌ Incorrect :**
```javascript
// Ne fonctionne pas - categoryColor n'existe pas
const color = categoryColor; // ReferenceError!
```

**✅ Correct :**
```javascript
// Accès via l'objet category
const color = article.category?.color || '#007bff';
```

---

## 📋 Structure de l'objet Category

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

---

## 💻 Exemples d'Utilisation dans le Code

### ✅ Exemple 1 : Dans un composant ArticleCard

```javascript
import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {
  // ✅ CORRECT : Définir categoryColor depuis article.category
  const categoryColor = article.category?.color || '#1E40AF'
  const categoryName = article.category?.name || 'Général'
  
  return (
    <article>
      <div className="category-badge">
        <span 
          style={{ backgroundColor: categoryColor }}
        >
          {categoryName}
        </span>
      </div>
      <h2>{article.title}</h2>
    </article>
  )
}
```

### ✅ Exemple 2 : Dans une liste d'articles

```javascript
function ArticlesList({ articles }) {
  return (
    <div>
      {articles.map(article => {
        // ✅ CORRECT : Définir categoryColor pour chaque article
        const categoryColor = article.category?.color || '#007bff'
        
        return (
          <ArticleCard 
            key={article._id} 
            article={article}
            categoryColor={categoryColor}
          />
        )
      })}
    </div>
  )
}
```

### ✅ Exemple 3 : Avec destructuration

```javascript
function ArticleCard({ article }) {
  // ✅ CORRECT : Destructurer la catégorie
  const { category } = article
  const categoryColor = category?.color || '#007bff'
  const categoryName = category?.name || 'Sans catégorie'
  
  return (
    <div>
      <span style={{ color: categoryColor }}>
        {categoryName}
      </span>
      <h2>{article.title}</h2>
    </div>
  )
}
```

### ✅ Exemple 4 : Fonction utilitaire

```javascript
// ✅ CORRECT : Créer une fonction utilitaire
const getCategoryColor = (article) => {
  return article?.category?.color || '#007bff'
}

// Utilisation
function ArticleCard({ article }) {
  const color = getCategoryColor(article)
  
  return (
    <div style={{ borderColor: color }}>
      {article.title}
    </div>
  )
}
```

---

## 🛠️ Correction dans le Code Frontend

### ❌ Code à éviter

```javascript
// ❌ MAUVAIS : Utiliser categoryColor sans le définir
function ArticleCard({ article }) {
  return (
    <div>
      <span style={{ color: categoryColor }}> {/* Erreur ! */}
        {article.category?.name}
      </span>
    </div>
  )
}
```

### ✅ Code correct

```javascript
// ✅ BON : Définir categoryColor avant de l'utiliser
function ArticleCard({ article }) {
  const categoryColor = article.category?.color || '#007bff'
  
  return (
    <div>
      <span style={{ color: categoryColor }}>
        {article.category?.name}
      </span>
    </div>
  )
}
```

---

## 🔍 Vérification

### Tester dans la console du navigateur

```javascript
// Vérifier la structure de l'article
fetch('https://xcafrique-backend.vercel.app/api/articles')
  .then(res => res.json())
  .then(data => {
    const article = data.data[0]
    console.log('Article:', article)
    console.log('Catégorie:', article?.category)
    console.log('Couleur:', article?.category?.color)
  })
```

### Vérifier dans le code

```javascript
// Ajouter un console.log pour déboguer
const categoryColor = article.category?.color || '#007bff'
console.log('Category color:', categoryColor)
console.log('Article category:', article.category)
```

---

## 📝 Bonnes Pratiques

### 1. ✅ Toujours utiliser l'optional chaining

```javascript
// ✅ BON
const color = article.category?.color || '#007bff'

// ❌ MAUVAIS (peut causer une erreur si category est null)
const color = article.category.color || '#007bff'
```

### 2. ✅ Toujours fournir une valeur par défaut

```javascript
// ✅ BON
const color = article.category?.color || '#007bff'

// ⚠️ RISQUÉ (peut être undefined)
const color = article.category?.color
```

### 3. ✅ Définir la variable dans le scope approprié

```javascript
// ✅ BON : Défini dans le composant
function ArticleCard({ article }) {
  const categoryColor = article.category?.color || '#007bff'
  // ...
}

// ❌ MAUVAIS : Utilisé sans être défini
function ArticleCard({ article }) {
  // categoryColor n'est pas défini ici
  return <div style={{ color: categoryColor }}> {/* Erreur ! */}
}
```

### 4. ✅ Vérifier que l'article existe avant d'accéder à category

```javascript
// ✅ BON : Vérifier d'abord
if (!article) return null

const categoryColor = article.category?.color || '#007bff'

// ✅ BON : Early return
if (!article || !article.category) {
  return <div>Article sans catégorie</div>
}

const categoryColor = article.category.color || '#007bff'
```

---

## 🐛 Dépannage

### Erreur : `categoryColor is not defined`

**Causes possibles :**
1. La variable `categoryColor` n'a pas été définie avant d'être utilisée
2. La variable est définie dans un scope différent
3. L'article n'existe pas encore (chargement asynchrone)

**Solutions :**
1. Définir `categoryColor` avant de l'utiliser :
   ```javascript
   const categoryColor = article.category?.color || '#007bff'
   ```

2. Vérifier que l'article existe :
   ```javascript
   if (!article) return null
   const categoryColor = article.category?.color || '#007bff'
   ```

3. Utiliser l'optional chaining :
   ```javascript
   const color = article?.category?.color || '#007bff'
   ```

### Erreur : `Cannot read property 'color' of undefined`

**Cause :** `article.category` est `undefined` ou `null`

**Solution :** Utiliser l'optional chaining
```javascript
// ❌ MAUVAIS
const color = article.category.color // Erreur si category est undefined

// ✅ BON
const color = article.category?.color || '#007bff'
```

---

## 📚 Références dans le Code

### Fichiers où categoryColor est correctement utilisé

- ✅ `src/components/ArticleCard.jsx` - Ligne 23
- ✅ `src/components/NewsSection.jsx` - Ligne 57
- ✅ `src/pages/ArticleDetail.jsx` - Ligne 129
- ✅ `src/components/CategoryList.jsx` - Ligne 177

### Pattern à suivre

```javascript
// Pattern standard utilisé dans tout le projet
const categoryColor = article.category?.color || '#1E40AF' // ou autre couleur par défaut
```

---

## ✅ Checklist

Avant d'utiliser `categoryColor`, vérifier :

- [ ] La variable `categoryColor` est définie avant d'être utilisée
- [ ] L'optional chaining (`?.`) est utilisé : `article.category?.color`
- [ ] Une valeur par défaut est fournie : `|| '#007bff'`
- [ ] L'article existe avant d'accéder à sa catégorie
- [ ] Le code est dans le bon scope (pas dans un callback sans accès à `article`)

---

## 🔗 Voir Aussi

- `API_DOCUMENTATION.md` - Structure complète de l'API
- `INSTRUCTIONS_BACKEND_FILTRE_CATEGORIE.md` - Instructions backend
- `GUIDE_PUBLICATION_ARTICLE.md` - Guide de publication

---

**Dernière mise à jour :** Janvier 2025  
**Version :** 1.0.0


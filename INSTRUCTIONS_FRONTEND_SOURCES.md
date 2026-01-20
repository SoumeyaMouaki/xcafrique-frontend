# 📋 Instructions Frontend : Affichage des Sources

## ✅ Ce qui a été fait

Le frontend a été modifié pour afficher les sources des articles dans la page de détail (`ArticleDetail.jsx`).

## 📍 Emplacement

Les sources s'affichent :
- **Après** le contenu de l'article
- **Avant** la section de partage social
- Avec un titre "Sources" et une icône de livre

## 🎨 Design

- Titre avec icône de livre
- Liste à puces avec liens externes
- Icône de lien externe (↗) à côté de chaque source
- Couleur orange pour les puces
- Liens en couleur primaire qui deviennent orange au survol
- Ouverture dans un nouvel onglet (`target="_blank"`)
- Sécurité : `rel="noopener noreferrer"`

## 📊 Formats supportés

Le frontend supporte **deux formats** pour plus de flexibilité :

### Format 1 : Tableau d'objets (recommandé)
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

### Format 2 : Tableau de strings (simple)
```json
{
  "sources": [
    "https://example.com/article",
    "https://example.com/news"
  ]
}
```

## 🔍 Code ajouté

```jsx
{/* Sources */}
{article.sources && article.sources.length > 0 && (
  <div className="border-t border-gray-200 pt-8 mt-8 mb-8">
    <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      Sources
    </h3>
    <ul className="space-y-3">
      {article.sources.map((source, index) => {
        const sourceUrl = typeof source === 'string' ? source : source.url
        const sourceTitle = typeof source === 'string' ? source : (source.title || source.url)
        
        return (
          <li key={index} className="flex items-start">
            <span className="text-accent-orange mr-2 mt-1">•</span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark hover:text-accent-orange transition-colors break-words flex-1"
            >
              {sourceTitle}
              <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        )
      })}
    </ul>
  </div>
)}
```

## ✅ Fonctionnalités

1. **Affichage conditionnel** : Les sources ne s'affichent que si elles existent et ne sont pas vides
2. **Format flexible** : Supporte les deux formats (objet ou string)
3. **Sécurité** : `rel="noopener noreferrer"` pour éviter les vulnérabilités
4. **Accessibilité** : Liens cliquables avec indication visuelle (icône externe)
5. **Responsive** : S'adapte à tous les écrans
6. **Style cohérent** : Utilise les couleurs du thème (primary-dark, accent-orange)

## 🧪 Test

Pour tester :
1. Créez un article avec des sources dans MongoDB
2. Ouvrez la page de détail de l'article
3. Vérifiez que les sources s'affichent correctement
4. Cliquez sur une source pour vérifier qu'elle s'ouvre dans un nouvel onglet

## 📝 Exemple de test

```javascript
// Dans MongoDB
db.articles.updateOne(
  { slug: "test-article" },
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
      ]
    }
  }
)
```

Puis visitez : `http://localhost:5173/article/test-article`

## 🎯 Prochaines étapes

1. ✅ Frontend prêt à afficher les sources
2. ⏳ Backend doit ajouter le champ `sources` dans le modèle Article
3. ⏳ Ajouter des sources aux articles existants si nécessaire


# 🎨 Guide : Application des Couleurs de Catégories

## 📋 Couleurs des Catégories

Voici les couleurs à appliquer pour chaque catégorie :

| Catégorie | Couleur | Code Hex |
|-----------|---------|----------|
| Incidents & Sécurité | Rouge | `#DC2626` |
| Aéroports & Infrastructures | Bleu | `#2563EB` |
| Compagnies aériennes | Vert émeraude | `#059669` |
| Opérations & Météo | Violet | `#7C3AED` |
| Passagers & Service | Orange | `#EA580C` |
| Réglementation & Conformité | Cyan | `#0891B2` |
| Flotte & Technologie | Rose | `#BE185D` |
| Économie & Finance | Jaune | `#CA8A04` |
| Développement durable | Vert | `#16A34A` |
| Formation & Emploi | Violet clair | `#9333EA` |
| Aviation africaine | Orange vif | `#FF6B35` |

## 🔧 Méthode 1 : Script Automatique (Recommandé)

### Étape 1 : Exécuter le script

```bash
node scripts/updateCategoryColors.js
```

Le script va :
1. Se connecter à MongoDB
2. Chercher chaque catégorie par nom
3. Mettre à jour la couleur si trouvée
4. Afficher un résumé des mises à jour

### Étape 2 : Vérifier les résultats

Le script affichera :
- ✅ Les catégories mises à jour
- ⚠️ Les catégories non trouvées
- 📋 La liste complète des catégories avec leurs couleurs actuelles

## 🔧 Méthode 2 : MongoDB Compass (Manuel)

### Étape 1 : Ouvrir MongoDB Compass

1. Connectez-vous avec cette URI :
   ```
   mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique
   ```

2. Sélectionnez la base `XCAfrique` → collection `categories`

### Étape 2 : Mettre à jour chaque catégorie

Pour chaque catégorie, cliquez sur "Edit Document" et ajoutez/modifiez le champ `color` :

```json
{
  "name": "Incidents & Sécurité",
  "color": "#DC2626"
}
```

**Répétez pour toutes les catégories :**

- `"Incidents & Sécurité"` → `"#DC2626"`
- `"Aéroports & Infrastructures"` → `"#2563EB"`
- `"Compagnies aériennes"` → `"#059669"`
- `"Opérations & Météo"` → `"#7C3AED"`
- `"Passagers & Service"` → `"#EA580C"`
- `"Réglementation & Conformité"` → `"#0891B2"`
- `"Flotte & Technologie"` → `"#BE185D"`
- `"Économie & Finance"` → `"#CA8A04"`
- `"Développement durable"` → `"#16A34A"`
- `"Formation & Emploi"` → `"#9333EA"`
- `"Aviation africaine"` → `"#FF6B35"`

## 🔧 Méthode 3 : MongoDB Shell (Ligne de commande)

```javascript
// Se connecter
mongosh "mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique"

// Mettre à jour les couleurs
db.categories.updateOne(
  { name: "Incidents & Sécurité" },
  { $set: { color: "#DC2626", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Aéroports & Infrastructures" },
  { $set: { color: "#2563EB", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Compagnies aériennes" },
  { $set: { color: "#059669", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Opérations & Météo" },
  { $set: { color: "#7C3AED", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Passagers & Service" },
  { $set: { color: "#EA580C", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Réglementation & Conformité" },
  { $set: { color: "#0891B2", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Flotte & Technologie" },
  { $set: { color: "#BE185D", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Économie & Finance" },
  { $set: { color: "#CA8A04", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Développement durable" },
  { $set: { color: "#16A34A", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Formation & Emploi" },
  { $set: { color: "#9333EA", updatedAt: new Date() } }
)

db.categories.updateOne(
  { name: "Aviation africaine" },
  { $set: { color: "#FF6B35", updatedAt: new Date() } }
)

// Vérifier les mises à jour
db.categories.find({}).forEach(cat => {
  print(`${cat.name}: ${cat.color || '❌ Pas de couleur'}`)
})
```

## ✅ Vérification

Après avoir mis à jour les couleurs :

1. **Rechargez votre site frontend**
2. **Vérifiez que les couleurs apparaissent** :
   - Dans les badges de catégories sur les articles
   - Dans la liste des catégories (sidebar)
   - Sur les cartes d'articles

3. **Testez avec un article** de chaque catégorie pour vérifier que la couleur est correcte

## 📝 Notes Importantes

- Les couleurs sont stockées dans MongoDB et récupérées via l'API
- Le frontend utilise automatiquement `article.category.color` pour afficher les couleurs
- Si une catégorie n'a pas de couleur, une couleur par défaut est utilisée (`#007bff` ou `#6B7280`)
- Les couleurs doivent être au format hexadécimal (ex: `#DC2626`)

## 🎨 Où les couleurs sont utilisées

1. **Badges de catégories** sur les articles (NewsSection, ArticleCard, ArticleDetail)
2. **Liste des catégories** (CategoryList) - bordure gauche et icône
3. **Compteur d'articles** dans CategoryList - badge avec couleur de fond
4. **Page Videos** - badges de catégories sur les vidéos

Toutes ces zones utilisent automatiquement `category.color` depuis l'API, donc une fois les couleurs mises à jour dans MongoDB, elles apparaîtront automatiquement sur le site !


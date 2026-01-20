# 🎨 Mise à Jour Rapide des Couleurs de Catégories

## ⚠️ Problème
Toutes les catégories ont la même couleur car les couleurs ne sont pas encore définies dans MongoDB.

## ✅ Solution Rapide : MongoDB Shell

### Étape 1 : Ouvrir MongoDB Shell

```bash
mongosh "mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique"
```

### Étape 2 : Copier-Coller ce Code

Copiez-collez tout ce code dans MongoDB Shell :

```javascript
// Mettre à jour toutes les couleurs en une seule fois
db.categories.updateOne({ name: "Incidents & Sécurité" }, { $set: { color: "#DC2626", updatedAt: new Date() } })
db.categories.updateOne({ name: "Aéroports & Infrastructures" }, { $set: { color: "#2563EB", updatedAt: new Date() } })
db.categories.updateOne({ name: "Compagnies aériennes" }, { $set: { color: "#059669", updatedAt: new Date() } })
db.categories.updateOne({ name: "Opérations & Météo" }, { $set: { color: "#7C3AED", updatedAt: new Date() } })
db.categories.updateOne({ name: "Passagers & Service" }, { $set: { color: "#EA580C", updatedAt: new Date() } })
db.categories.updateOne({ name: "Réglementation & Conformité" }, { $set: { color: "#0891B2", updatedAt: new Date() } })
db.categories.updateOne({ name: "Flotte & Technologie" }, { $set: { color: "#BE185D", updatedAt: new Date() } })
db.categories.updateOne({ name: "Économie & Finance" }, { $set: { color: "#CA8A04", updatedAt: new Date() } })
db.categories.updateOne({ name: "Développement durable" }, { $set: { color: "#16A34A", updatedAt: new Date() } })
db.categories.updateOne({ name: "Formation & Emploi" }, { $set: { color: "#9333EA", updatedAt: new Date() } })
db.categories.updateOne({ name: "Aviation africaine" }, { $set: { color: "#FF6B35", updatedAt: new Date() } })

// Vérifier
db.categories.find({}).forEach(cat => {
  print(`${cat.name}: ${cat.color || '❌ Pas de couleur'}`)
})
```

### Étape 3 : Vérifier

Vous devriez voir toutes les catégories avec leurs couleurs respectives.

## 🔧 Alternative : MongoDB Compass

1. **Ouvrez MongoDB Compass**
2. **Connectez-vous** avec :
   ```
   mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique
   ```
3. **Base** : `XCAfrique` → **Collection** : `categories`
4. **Pour chaque catégorie** :
   - Cliquez sur la catégorie
   - Cliquez sur "Edit Document"
   - Ajoutez le champ `color` avec la valeur correspondante :
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
   - Sauvegardez

## ✅ Après la Mise à Jour

1. **Rechargez votre site** (Ctrl+F5 pour vider le cache)
2. **Vérifiez** que chaque catégorie a maintenant sa couleur unique
3. **Testez** avec différents articles pour voir les différentes couleurs

Les couleurs apparaîtront automatiquement sur le site ! 🎨


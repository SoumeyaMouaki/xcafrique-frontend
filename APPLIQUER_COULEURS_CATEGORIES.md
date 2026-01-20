# 🎨 Appliquer les Couleurs des Catégories

## 📋 Couleurs à Appliquer

| Catégorie | Couleur |
|-----------|---------|
| Incidents & Sécurité | `#DC2626` |
| Aéroports & Infrastructures | `#2563EB` |
| Compagnies aériennes | `#059669` |
| Opérations & Météo | `#7C3AED` |
| Passagers & Service | `#EA580C` |
| Réglementation & Conformité | `#0891B2` |
| Flotte & Technologie | `#BE185D` |
| Économie & Finance | `#CA8A04` |
| Développement durable | `#16A34A` |
| Formation & Emploi | `#9333EA` |
| Aviation africaine | `#FF6B35` |

## 🚀 Méthode Rapide : MongoDB Compass

1. **Ouvrez MongoDB Compass**
2. **Connectez-vous** avec :
   ```
   mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique
   ```
3. **Base** : `XCAfrique` → **Collection** : `categories`
4. **Pour chaque catégorie** :
   - Cliquez sur la catégorie
   - Cliquez sur "Edit Document"
   - Ajoutez/modifiez le champ `color` avec la valeur correspondante
   - Sauvegardez

## 📝 Commandes MongoDB Shell (Copier-Coller)

```javascript
// Se connecter
mongosh "mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique"

// Mettre à jour toutes les couleurs en une fois
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
db.categories.find({}).forEach(cat => print(`${cat.name}: ${cat.color || '❌ Pas de couleur'}`))
```

## ✅ Après Application

1. **Rechargez votre site** - Les couleurs apparaîtront automatiquement
2. **Vérifiez** dans les badges de catégories sur les articles
3. **Testez** avec différents articles pour voir les couleurs

Les couleurs seront automatiquement utilisées par le frontend ! 🎨


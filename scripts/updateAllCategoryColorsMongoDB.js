/**
 * Script MongoDB pour mettre à jour TOUTES les couleurs des catégories en une seule fois
 * 
 * Copiez-collez ce code dans MongoDB Shell ou MongoDB Compass
 */

// Se connecter à MongoDB
// ⚠️  IMPORTANT: Ne jamais hardcoder les credentials MongoDB dans le code
// Utilisez une variable d'environnement ou MongoDB Compass avec votre connexion configurée
// Exemple: mongosh "$MONGODB_URI_PROD"

// Mettre à jour toutes les couleurs en une seule fois
const categoryColors = {
  'Incidents & Sécurité': '#DC2626',
  'Aéroports & Infrastructures': '#2563EB',
  'Compagnies aériennes': '#059669',
  'Opérations & Météo': '#7C3AED',
  'Passagers & Service': '#EA580C',
  'Réglementation & Conformité': '#0891B2',
  'Flotte & Technologie': '#BE185D',
  'Économie & Finance': '#CA8A04',
  'Développement durable': '#16A34A',
  'Formation & Emploi': '#9333EA',
  'Aviation africaine': '#FF6B35'
}

// Mettre à jour chaque catégorie
for (const [name, color] of Object.entries(categoryColors)) {
  const result = db.categories.updateOne(
    { name: name },
    { 
      $set: { 
        color: color,
        updatedAt: new Date()
      } 
    }
  )
  
  if (result.matchedCount > 0) {
    if (result.modifiedCount > 0) {
      print(`✅ ${name}: ${color}`)
    } else {
      print(`ℹ️  ${name}: Déjà à jour (${color})`)
    }
  } else {
    print(`⚠️  ${name}: Non trouvée`)
  }
}

// Vérifier les résultats
print('\n📋 Vérification des couleurs:')
db.categories.find({}).forEach(cat => {
  const expectedColor = categoryColors[cat.name]
  const status = cat.color === expectedColor ? '✅' : cat.color ? '⚠️' : '❌'
  print(`${status} ${cat.name}: ${cat.color || 'Pas de couleur'} ${expectedColor ? `(attendu: ${expectedColor})` : ''}`)
})



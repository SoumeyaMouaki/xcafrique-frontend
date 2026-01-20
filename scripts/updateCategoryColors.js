/**
 * Script pour mettre à jour les couleurs des catégories dans MongoDB
 * 
 * Usage:
 *   node scripts/updateCategoryColors.js
 * 
 * Variables d'environnement requises:
 *   MONGODB_URI_PROD=mongodb+srv://...
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI_PROD || 'mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique'

// Mapping des couleurs par nom de catégorie
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

async function updateCategoryColors() {
  let client

  try {
    console.log('🔌 Connexion à MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connecté à MongoDB\n')

    const db = client.db()
    const categoriesCollection = db.collection('categories')

    console.log('📊 Mise à jour des couleurs des catégories...\n')

    let updated = 0
    let notFound = []

    for (const [categoryName, color] of Object.entries(categoryColors)) {
      try {
        // Chercher la catégorie par nom (insensible à la casse)
        const result = await categoriesCollection.updateOne(
          { 
            name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
          },
          {
            $set: {
              color: color,
              updatedAt: new Date()
            }
          }
        )

        if (result.matchedCount > 0) {
          if (result.modifiedCount > 0) {
            console.log(`✅ ${categoryName}: ${color}`)
            updated++
          } else {
            console.log(`ℹ️  ${categoryName}: Déjà à jour (${color})`)
          }
        } else {
          console.log(`⚠️  ${categoryName}: Non trouvée`)
          notFound.push(categoryName)
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${categoryName}:`, error.message)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 Résumé')
    console.log('='.repeat(60))
    console.log(`✅ Catégories mises à jour: ${updated}`)
    
    if (notFound.length > 0) {
      console.log(`⚠️  Catégories non trouvées: ${notFound.length}`)
      notFound.forEach(name => console.log(`   - ${name}`))
      console.log('\n💡 Vérifiez que les noms des catégories dans MongoDB correspondent exactement.')
    }

    // Afficher toutes les catégories avec leurs couleurs actuelles
    console.log('\n📋 Catégories actuelles dans MongoDB:')
    const allCategories = await categoriesCollection.find({}).toArray()
    allCategories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.color || '❌ Pas de couleur'}`)
    })

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
  } finally {
    if (client) {
      await client.close()
      console.log('\n🔌 Déconnecté de MongoDB')
    }
  }
}

updateCategoryColors().catch(console.error)


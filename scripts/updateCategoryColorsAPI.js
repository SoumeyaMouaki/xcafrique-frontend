/**
 * Script pour mettre à jour les couleurs des catégories via l'API backend
 * 
 * Usage dans le navigateur :
 *   1. Ouvrez la console du navigateur (F12)
 *   2. Copiez-collez ce script
 *   3. Modifiez les couleurs si nécessaire
 *   4. Exécutez le script
 * 
 * OU via Node.js avec fetch :
 *   node scripts/updateCategoryColorsAPI.js
 */

// Configuration
const API_BASE_URL = 'https://xcafrique-backend.vercel.app/api'

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
  console.log('🎨 Mise à jour des couleurs des catégories\n')
  console.log('='.repeat(60))

  try {
    // 1. Récupérer toutes les catégories
    console.log('📡 Récupération des catégories...')
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)
    const categoriesData = await categoriesResponse.json()

    if (!categoriesData.success) {
      console.error('❌ Erreur lors de la récupération des catégories:', categoriesData.message)
      return
    }

    const categories = categoriesData.data || []
    console.log(`✅ ${categories.length} catégories trouvées\n`)

    // 2. Mettre à jour chaque catégorie
    let updated = 0
    let notFound = []
    let errors = []

    for (const [categoryName, color] of Object.entries(categoryColors)) {
      try {
        // Trouver la catégorie correspondante (insensible à la casse)
        const category = categories.find(
          cat => cat.name && cat.name.toLowerCase() === categoryName.toLowerCase()
        )

        if (!category) {
          console.log(`⚠️  "${categoryName}": Non trouvée`)
          notFound.push(categoryName)
          continue
        }

        // Vérifier si la couleur est déjà correcte
        if (category.color === color) {
          console.log(`ℹ️  "${categoryName}": Déjà à jour (${color})`)
          continue
        }

        // Mettre à jour via l'API (si endpoint existe)
        // Note: Si l'API ne supporte pas la mise à jour, utilisez MongoDB directement
        console.log(`🔄 "${categoryName}": ${category.color || 'Pas de couleur'} → ${color}`)
        
        // Si l'API supporte PUT /categories/:id
        try {
          const updateResponse = await fetch(`${API_BASE_URL}/categories/${category._id || category.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              color: color
            })
          })

          if (updateResponse.ok) {
            console.log(`✅ "${categoryName}": Mise à jour réussie`)
            updated++
          } else {
            const errorData = await updateResponse.json()
            console.log(`⚠️  "${categoryName}": Erreur API - ${errorData.message || updateResponse.statusText}`)
            errors.push({ name: categoryName, error: errorData.message || updateResponse.statusText })
          }
        } catch (apiError) {
          // Si l'API ne supporte pas PUT, afficher les instructions MongoDB
          console.log(`⚠️  "${categoryName}": L'API ne supporte pas la mise à jour`)
          console.log(`   → Utilisez MongoDB directement (voir GUIDE_COULEURS_CATEGORIES.md)`)
          errors.push({ name: categoryName, error: 'API ne supporte pas PUT' })
        }

      } catch (error) {
        console.error(`❌ Erreur pour "${categoryName}":`, error.message)
        errors.push({ name: categoryName, error: error.message })
      }
    }

    // 3. Résumé
    console.log('\n' + '='.repeat(60))
    console.log('📋 Résumé')
    console.log('='.repeat(60))
    console.log(`✅ Catégories mises à jour: ${updated}`)
    console.log(`⚠️  Catégories non trouvées: ${notFound.length}`)
    console.log(`❌ Erreurs: ${errors.length}`)

    if (notFound.length > 0) {
      console.log('\n⚠️  Catégories non trouvées dans MongoDB:')
      notFound.forEach(name => console.log(`   - ${name}`))
    }

    if (errors.length > 0) {
      console.log('\n❌ Erreurs:')
      errors.forEach(({ name, error }) => console.log(`   - ${name}: ${error}`))
    }

    // 4. Afficher les couleurs actuelles
    console.log('\n📋 Couleurs actuelles des catégories:')
    categories.forEach(cat => {
      const expectedColor = categoryColors[cat.name]
      const status = cat.color === expectedColor ? '✅' : cat.color ? '⚠️' : '❌'
      console.log(`   ${status} ${cat.name}: ${cat.color || 'Pas de couleur'} ${expectedColor ? `(attendu: ${expectedColor})` : ''}`)
    })

    console.log('\n💡 Si certaines catégories n\'ont pas été mises à jour, utilisez MongoDB directement.')
    console.log('   Consultez GUIDE_COULEURS_CATEGORIES.md pour les instructions MongoDB.')

  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
    console.error(error)
  }
}

// Exécuter le script
if (typeof window !== 'undefined') {
  // Dans le navigateur
  window.updateCategoryColors = updateCategoryColors
  console.log('💡 Script chargé. Exécutez: updateCategoryColors()')
} else {
  // Dans Node.js (si fetch est disponible)
  updateCategoryColors().catch(console.error)
}


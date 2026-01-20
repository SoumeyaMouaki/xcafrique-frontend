/**
 * Script pour vérifier les couleurs actuelles des catégories
 * 
 * Usage dans le navigateur :
 *   1. Ouvrez la console du navigateur (F12)
 *   2. Copiez-collez ce script
 *   3. Exécutez: checkCategoryColors()
 */

const API_BASE_URL = 'https://xcafrique-backend.vercel.app/api'

async function checkCategoryColors() {
  console.log('🔍 Vérification des couleurs des catégories\n')
  console.log('='.repeat(60))

  try {
    // Récupérer toutes les catégories
    const response = await fetch(`${API_BASE_URL}/categories`)
    const data = await response.json()

    if (!data.success) {
      console.error('❌ Erreur:', data.message)
      return
    }

    const categories = data.data || []
    console.log(`📊 ${categories.length} catégories trouvées\n`)

    // Couleurs attendues
    const expectedColors = {
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

    console.log('📋 Couleurs actuelles des catégories:\n')
    
    let sameColor = true
    let firstColor = null
    let categoriesWithoutColor = []
    let categoriesWithWrongColor = []

    categories.forEach((cat, index) => {
      const expectedColor = expectedColors[cat.name]
      const currentColor = cat.color || null
      
      if (index === 0) {
        firstColor = currentColor
      } else if (currentColor !== firstColor) {
        sameColor = false
      }

      if (!currentColor) {
        categoriesWithoutColor.push(cat.name)
        console.log(`❌ ${cat.name}: Pas de couleur`)
      } else if (expectedColor && currentColor !== expectedColor) {
        categoriesWithWrongColor.push({ name: cat.name, current: currentColor, expected: expectedColor })
        console.log(`⚠️  ${cat.name}: ${currentColor} (attendu: ${expectedColor})`)
      } else {
        console.log(`✅ ${cat.name}: ${currentColor}`)
      }
    })

    console.log('\n' + '='.repeat(60))
    console.log('📊 Résumé')
    console.log('='.repeat(60))
    
    if (sameColor && firstColor) {
      console.log(`⚠️  PROBLÈME: Toutes les catégories ont la même couleur: ${firstColor}`)
      console.log('   → Les couleurs doivent être mises à jour dans MongoDB')
    }

    if (categoriesWithoutColor.length > 0) {
      console.log(`\n❌ Catégories sans couleur: ${categoriesWithoutColor.length}`)
      categoriesWithoutColor.forEach(name => console.log(`   - ${name}`))
    }

    if (categoriesWithWrongColor.length > 0) {
      console.log(`\n⚠️  Catégories avec mauvaise couleur: ${categoriesWithWrongColor.length}`)
      categoriesWithWrongColor.forEach(({ name, current, expected }) => {
        console.log(`   - ${name}: ${current} → devrait être ${expected}`)
      })
    }

    console.log('\n💡 Pour mettre à jour les couleurs, utilisez MongoDB Compass ou le script:')
    console.log('   Consultez APPLIQUER_COULEURS_CATEGORIES.md')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
  }
}

// Exposer la fonction globalement pour le navigateur
if (typeof window !== 'undefined') {
  window.checkCategoryColors = checkCategoryColors
  console.log('💡 Script chargé. Exécutez: checkCategoryColors()')
} else {
  checkCategoryColors().catch(console.error)
}


/**
 * Script de test pour vérifier que le filtre par catégorie fonctionne correctement
 * 
 * Usage:
 *   node scripts/testCategoryFilter.js [API_URL]
 * 
 * Exemple:
 *   node scripts/testCategoryFilter.js https://xcafrique-backend.vercel.app/api
 */

const API_BASE_URL = process.argv[2] || 'https://xcafrique-backend.vercel.app/api'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testEndpoint(url, description) {
  try {
    log(`\n🔍 Test: ${description}`, 'cyan')
    log(`   URL: ${url}`, 'blue')
    
    const response = await fetch(url)
    const data = await response.json()
    
    // Vérifier le statut HTTP
    if (response.status === 200) {
      log(`   ✅ Status: ${response.status} OK`, 'green')
    } else if (response.status === 404) {
      log(`   ❌ Status: ${response.status} Not Found (ERREUR - devrait être 200)`, 'red')
      return { success: false, error: '404 au lieu de 200' }
    } else {
      log(`   ⚠️  Status: ${response.status}`, 'yellow')
    }
    
    // Vérifier la structure de la réponse
    if (data.success === true) {
      log(`   ✅ Structure: success = true`, 'green')
    } else {
      log(`   ❌ Structure: success = ${data.success} (devrait être true)`, 'red')
      return { success: false, error: 'Structure incorrecte' }
    }
    
    // Vérifier que data est un tableau
    if (Array.isArray(data.data)) {
      log(`   ✅ Type: data est un tableau`, 'green')
      log(`   📊 Résultats: ${data.data.length} article(s)`, 'blue')
    } else {
      log(`   ❌ Type: data n'est pas un tableau`, 'red')
      return { success: false, error: 'data n\'est pas un tableau' }
    }
    
    // Vérifier les métadonnées de pagination
    if (data.count !== undefined && data.total !== undefined && data.page !== undefined) {
      log(`   ✅ Pagination: count=${data.count}, total=${data.total}, page=${data.page}`, 'green')
    } else {
      log(`   ⚠️  Pagination: Métadonnées manquantes`, 'yellow')
    }
    
    return { success: true, data }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red')
    return { success: false, error: error.message }
  }
}

async function runTests() {
  log('\n═══════════════════════════════════════════════════════════', 'cyan')
  log('🧪 Tests du Filtre par Catégorie - Backend API', 'cyan')
  log('═══════════════════════════════════════════════════════════\n', 'cyan')
  
  const results = []
  
  // Test 1: Tous les articles (sans filtre)
  results.push(await testEndpoint(
    `${API_BASE_URL}/articles`,
    'Tous les articles (sans filtre)'
  ))
  
  // Test 2: Catégorie existante (passagers-service)
  results.push(await testEndpoint(
    `${API_BASE_URL}/articles?category=passagers-service`,
    'Catégorie existante: passagers-service'
  ))
  
  // Test 3: Catégorie inexistante (devrait retourner 200 avec tableau vide)
  results.push(await testEndpoint(
    `${API_BASE_URL}/articles?category=categorie-inexistante-12345`,
    'Catégorie inexistante (devrait être 200 avec data: [])'
  ))
  
  // Test 4: Catégorie avec pagination
  results.push(await testEndpoint(
    `${API_BASE_URL}/articles?category=passagers-service&page=1&limit=5`,
    'Catégorie avec pagination'
  ))
  
  // Test 5: Recherche de catégories disponibles
  log(`\n🔍 Récupération des catégories disponibles...`, 'cyan')
  try {
    const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)
    const categoriesData = await categoriesResponse.json()
    
    if (categoriesData.success && Array.isArray(categoriesData.data)) {
      log(`   ✅ ${categoriesData.data.length} catégorie(s) trouvée(s)`, 'green')
      
      // Tester avec les 3 premières catégories
      const testCategories = categoriesData.data.slice(0, 3)
      for (const category of testCategories) {
        const slug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-')
        if (slug) {
          results.push(await testEndpoint(
            `${API_BASE_URL}/articles?category=${encodeURIComponent(slug)}`,
            `Catégorie: ${category.name || slug}`
          ))
        }
      }
    }
  } catch (error) {
    log(`   ⚠️  Impossible de récupérer les catégories: ${error.message}`, 'yellow')
  }
  
  // Résumé des résultats
  log('\n═══════════════════════════════════════════════════════════', 'cyan')
  log('📊 Résumé des Tests', 'cyan')
  log('═══════════════════════════════════════════════════════════\n', 'cyan')
  
  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length
  
  log(`✅ Tests réussis: ${successCount}`, 'green')
  log(`❌ Tests échoués: ${failCount}`, failCount > 0 ? 'red' : 'green')
  
  if (failCount > 0) {
    log('\n⚠️  Des tests ont échoué. Vérifiez les instructions dans:', 'yellow')
    log('   INSTRUCTIONS_BACKEND_FILTRE_CATEGORIE.md', 'yellow')
  } else {
    log('\n🎉 Tous les tests sont passés !', 'green')
  }
  
  // Vérifier spécifiquement le problème 404
  const has404Error = results.some(r => r.error === '404 au lieu de 200')
  if (has404Error) {
    log('\n🔴 PROBLÈME CRITIQUE DÉTECTÉ:', 'red')
    log('   Le backend retourne 404 pour certaines catégories.', 'red')
    log('   Cela doit être corrigé selon les instructions.', 'red')
    log('   Consultez: INSTRUCTIONS_BACKEND_FILTRE_CATEGORIE.md', 'yellow')
  }
  
  process.exit(failCount > 0 ? 1 : 0)
}

// Exécuter les tests
runTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red')
  process.exit(1)
})


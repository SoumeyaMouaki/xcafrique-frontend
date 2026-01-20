/**
 * Script pour tester les headers CORS du backend
 * 
 * Usage:
 *   node scripts/testCors.js
 */

const testCors = async () => {
  const origins = [
    'https://xcafrique.org',
    'https://www.xcafrique.org',
    'https://xcafrique-frontend.vercel.app'
  ]

  const backendUrl = 'https://xcafrique-backend.vercel.app'
  const endpoint = '/api/articles'

  console.log('🧪 Test des headers CORS du backend\n')
  console.log(`Backend: ${backendUrl}`)
  console.log(`Endpoint: ${endpoint}\n`)

  for (const origin of origins) {
    console.log(`\n📡 Test avec Origin: ${origin}`)
    console.log('─'.repeat(60))

    try {
      // Test OPTIONS (preflight)
      const optionsResponse = await fetch(`${backendUrl}${endpoint}`, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      })

      console.log(`Status: ${optionsResponse.status}`)
      console.log('Headers CORS:')
      console.log(`  Access-Control-Allow-Origin: ${optionsResponse.headers.get('Access-Control-Allow-Origin') || '❌ MANQUANT'}`)
      console.log(`  Access-Control-Allow-Methods: ${optionsResponse.headers.get('Access-Control-Allow-Methods') || '❌ MANQUANT'}`)
      console.log(`  Access-Control-Allow-Headers: ${optionsResponse.headers.get('Access-Control-Allow-Headers') || '❌ MANQUANT'}`)

      if (optionsResponse.headers.get('Access-Control-Allow-Origin') === origin || 
          optionsResponse.headers.get('Access-Control-Allow-Origin') === '*') {
        console.log('  ✅ CORS configuré correctement')
      } else {
        console.log('  ❌ CORS non configuré pour cette origine')
      }

      // Test GET (requête réelle)
      const getResponse = await fetch(`${backendUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Origin': origin,
          'Content-Type': 'application/json'
        }
      })

      console.log(`\nGET Status: ${getResponse.status}`)
      console.log(`GET Access-Control-Allow-Origin: ${getResponse.headers.get('Access-Control-Allow-Origin') || '❌ MANQUANT'}`)

      if (getResponse.ok) {
        console.log('  ✅ Requête réussie')
      } else {
        console.log('  ❌ Requête échouée')
      }

    } catch (error) {
      console.error(`  ❌ Erreur: ${error.message}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📋 Résumé')
  console.log('='.repeat(60))
  console.log('\nSi Access-Control-Allow-Origin est ❌ MANQUANT ou différent de l\'origine testée:')
  console.log('1. Vérifiez que ALLOWED_ORIGINS contient bien l\'origine')
  console.log('2. Vérifiez que le backend a été redéployé après modification')
  console.log('3. Vérifiez les logs du backend sur Vercel pour des erreurs')
}

testCors().catch(console.error)


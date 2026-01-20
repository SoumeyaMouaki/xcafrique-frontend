/**
 * Script pour tester la publication d'un article via l'API
 * 
 * Usage:
 *   node scripts/testPublishArticle.js [slug-ou-id] [token-jwt]
 * 
 * Exemple:
 *   node scripts/testPublishArticle.js "brussels-airlines-..." "eyJhbGc..."
 */

const API_BASE_URL = process.env.VITE_API_URL || 'https://xcafrique-backend.vercel.app/api'

async function testPublishArticle(slugOrId, token) {
  try {
    console.log('🔍 Test de publication d\'article...\n')
    console.log('📡 URL API:', API_BASE_URL)
    console.log('🔑 Token:', token ? '✅ Fourni' : '❌ Manquant')
    console.log('📄 Slug/ID:', slugOrId)
    console.log('')

    // Méthode 1 : Essayer avec PATCH /admin/articles/:id
    if (token) {
      console.log('1️⃣  Tentative via API d\'administration...')
      try {
        const response = await fetch(`${API_BASE_URL}/admin/articles/${slugOrId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'published',
            publishedAt: new Date().toISOString()
          })
        })

        const data = await response.json()
        
        if (response.ok && data.success) {
          console.log('✅ Article publié via API d\'administration!')
          console.log('📄 Titre:', data.data?.title)
          console.log('🔗 Slug:', data.data?.slug)
          console.log('📅 Date:', data.data?.publishedAt)
          return true
        } else {
          console.log('❌ Erreur API:', data.message || response.statusText)
        }
      } catch (error) {
        console.log('❌ Erreur réseau:', error.message)
      }
    }

    // Méthode 2 : Vérifier si l'article existe déjà et est publié
    console.log('\n2️⃣  Vérification de l\'état actuel de l\'article...')
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${slugOrId}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        console.log('✅ Article trouvé et déjà publié!')
        console.log('📄 Titre:', data.data.title)
        console.log('📊 Statut:', data.data.status)
        console.log('📅 Date de publication:', data.data.publishedAt)
        return true
      } else {
        console.log('ℹ️  Article non trouvé ou non publié')
        console.log('💡 Vous devez le publier via MongoDB ou l\'API d\'administration')
      }
    } catch (error) {
      console.log('❌ Erreur:', error.message)
    }

    // Instructions
    console.log('\n📋 Instructions:')
    console.log('1. Si vous avez un token JWT, utilisez-le comme 2ème argument')
    console.log('2. Sinon, publiez l\'article directement dans MongoDB')
    console.log('3. Consultez GUIDE_PUBLICATION_ARTICLE.md pour plus de détails')

    return false
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    return false
  }
}

// Récupérer les arguments
const slugOrId = process.argv[2]
const token = process.argv[3]

if (!slugOrId) {
  console.error('❌ Usage: node scripts/testPublishArticle.js [slug-ou-id] [token-jwt]')
  console.error('')
  console.error('Exemples:')
  console.error('  node scripts/testPublishArticle.js "brussels-airlines-..."')
  console.error('  node scripts/testPublishArticle.js "507f1f77bcf86cd799439011" "eyJhbGc..."')
  process.exit(1)
}

testPublishArticle(slugOrId, token)
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })


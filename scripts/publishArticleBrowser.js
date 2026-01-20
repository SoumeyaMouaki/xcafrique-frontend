/**
 * Script à exécuter dans la console du navigateur (F12)
 * pour tester la publication d'un article via l'API
 * 
 * Copiez-collez ce code dans la console de votre navigateur
 * sur votre site XCAfrique
 */

// ⚙️ Configuration
const API_BASE_URL = 'https://xcafrique-backend.vercel.app/api' // Ajustez si nécessaire
const ARTICLE_SLUG_OR_ID = 'votre-slug-article' // Remplacez par le slug ou ID de votre article

// 🔑 Récupérer le token depuis localStorage (si disponible)
const token = localStorage.getItem('token')

/**
 * Fonction pour publier un article
 */
async function publishArticle(slugOrId) {
  console.log('🔍 Tentative de publication...\n')
  console.log('📡 API:', API_BASE_URL)
  console.log('📄 Article:', slugOrId)
  console.log('🔑 Token:', token ? '✅ Disponible' : '❌ Manquant\n')

  // Méthode 1 : Essayer avec l'API d'administration
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
        console.log('✅ Article publié avec succès!')
        console.log('📄 Titre:', data.data?.title)
        console.log('🔗 Slug:', data.data?.slug)
        console.log('📅 Date:', data.data?.publishedAt)
        return { success: true, data: data.data }
      } else {
        console.log('❌ Erreur:', data.message || response.statusText)
        console.log('💡 L\'endpoint d\'administration n\'existe peut-être pas')
      }
    } catch (error) {
      console.log('❌ Erreur réseau:', error.message)
    }
  } else {
    console.log('ℹ️  Pas de token disponible. L\'API d\'administration nécessite une authentification.')
  }

  // Méthode 2 : Vérifier l'état actuel
  console.log('\n2️⃣  Vérification de l\'état de l\'article...')
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${slugOrId}`)
    const data = await response.json()
    
    if (response.ok && data.success) {
      console.log('✅ Article trouvé!')
      console.log('📄 Titre:', data.data.title)
      console.log('📊 Statut:', data.data.status)
      console.log('📅 Date de publication:', data.data.publishedAt)
      
      if (data.data.status === 'published') {
        console.log('\n✅ L\'article est déjà publié!')
        return { success: true, alreadyPublished: true, data: data.data }
      } else {
        console.log('\n⚠️  L\'article n\'est pas encore publié.')
        console.log('💡 Vous devez le publier via MongoDB ou l\'API d\'administration')
      }
    } else {
      console.log('❌ Article non trouvé ou non publié')
      console.log('💡 Vérifiez que le slug est correct')
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message)
  }

  return { success: false }
}

/**
 * Fonction pour vérifier tous les articles non publiés
 */
async function checkUnpublishedArticles() {
  console.log('🔍 Recherche d\'articles non publiés...\n')
  
  // Note: Cette fonction nécessite un endpoint admin qui n'existe peut-être pas
  if (!token) {
    console.log('❌ Cette fonction nécessite une authentification')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/articles?status=draft`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (response.ok && data.success) {
      console.log(`📋 ${data.data.length} article(s) en brouillon trouvé(s):\n`)
      data.data.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`)
        console.log(`   Slug: ${article.slug}`)
        console.log(`   ID: ${article._id}\n`)
      })
    } else {
      console.log('ℹ️  L\'endpoint d\'administration n\'existe peut-être pas')
      console.log('💡 Utilisez MongoDB pour vérifier les articles en brouillon')
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message)
  }
}

// 🚀 Exécuter la fonction
// Décommentez la ligne suivante et remplacez ARTICLE_SLUG_OR_ID par votre slug
// publishArticle(ARTICLE_SLUG_OR_ID)

// Ou utilisez directement :
// publishArticle('brussels-airlines-valorise-la-richesse-culinaire-africaine')

console.log(`
📋 Instructions d'utilisation:

1. Remplacez ARTICLE_SLUG_OR_ID par le slug de votre article
2. Ou appelez directement: publishArticle('votre-slug-article')
3. Pour vérifier les articles non publiés: checkUnpublishedArticles()

💡 Si l'API d'administration n'existe pas, utilisez MongoDB directement.
   Consultez GUIDE_PUBLICATION_ARTICLE.md pour plus de détails.
`)


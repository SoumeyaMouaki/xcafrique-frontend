/**
 * Script pour vérifier et ajouter des sources aux articles en production
 * 
 * Usage:
 *   node scripts/checkAndAddSources.js
 * 
 * Variables d'environnement requises:
 *   MONGODB_URI_PROD=mongodb+srv://...
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI_PROD || 'mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique'

async function checkAndAddSources() {
  let client

  try {
    console.log('🔌 Connexion à MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connecté à MongoDB\n')

    const db = client.db()
    const articlesCollection = db.collection('articles')

    // Vérifier les articles existants
    console.log('📊 Vérification des articles...')
    const articles = await articlesCollection.find({ status: 'published' }).toArray()
    console.log(`📝 ${articles.length} articles publiés trouvés\n`)

    // Compter les articles avec et sans sources
    let withSources = 0
    let withoutSources = 0
    const articlesWithoutSources = []

    articles.forEach(article => {
      if (article.sources && Array.isArray(article.sources) && article.sources.length > 0) {
        withSources++
      } else {
        withoutSources++
        articlesWithoutSources.push({
          _id: article._id,
          title: article.title,
          slug: article.slug
        })
      }
    })

    console.log('📈 Statistiques:')
    console.log(`   ✅ Articles avec sources: ${withSources}`)
    console.log(`   ❌ Articles sans sources: ${withoutSources}\n`)

    // Afficher les articles sans sources
    if (articlesWithoutSources.length > 0) {
      console.log('📋 Articles sans sources:')
      articlesWithoutSources.forEach(article => {
        console.log(`   - ${article.title} (slug: ${article.slug})`)
      })
      console.log('')

      // Demander si on veut ajouter des sources
      console.log('💡 Pour ajouter des sources à un article, utilisez:')
      console.log('   db.articles.updateOne(')
      console.log('     { slug: "votre-slug" },')
      console.log('     {')
      console.log('       $set: {')
      console.log('         sources: [')
      console.log('           {')
      console.log('             title: "Nom de la source",')
      console.log('             url: "https://example.com/article"')
      console.log('           }')
      console.log('         ]')
      console.log('       }')
      console.log('     }')
      console.log('   )\n')
    }

    // Vérifier un article spécifique (exemple)
    if (articles.length > 0) {
      const firstArticle = articles[0]
      console.log('🔍 Exemple - Premier article:')
      console.log(`   Titre: ${firstArticle.title}`)
      console.log(`   Slug: ${firstArticle.slug}`)
      if (firstArticle.sources) {
        console.log(`   Sources: ${JSON.stringify(firstArticle.sources, null, 2)}`)
      } else {
        console.log('   Sources: ❌ Aucune')
      }
      console.log('')
    }

    // Fonction helper pour ajouter des sources à un article
    console.log('💡 Fonction helper pour ajouter des sources:')
    console.log(`
async function addSourcesToArticle(slug, sources) {
  const result = await articlesCollection.updateOne(
    { slug: slug },
    {
      $set: {
        sources: sources,
        updatedAt: new Date()
      }
    }
  )
  return result.modifiedCount > 0
}

// Exemple d'utilisation:
// await addSourcesToArticle('mon-article', [
//   { title: 'Source 1', url: 'https://example.com/1' },
//   { title: 'Source 2', url: 'https://example.com/2' }
// ])
`)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Déconnecté de MongoDB')
    }
  }
}

// Exécuter le script
checkAndAddSources().catch(console.error)


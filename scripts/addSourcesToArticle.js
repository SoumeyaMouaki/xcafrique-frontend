/**
 * Script pour ajouter des sources à un article spécifique en production
 * 
 * Usage:
 *   node scripts/addSourcesToArticle.js <slug> "<title1>" "<url1>" "<title2>" "<url2>" ...
 * 
 * Exemple:
 *   node scripts/addSourcesToArticle.js "mon-article" "Source 1" "https://example.com/1" "Source 2" "https://example.com/2"
 * 
 * Variables d'environnement requises:
 *   MONGODB_URI_PROD=mongodb+srv://...
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI_PROD || 'mongodb+srv://dawini-user:2005Xad5@cluster0.kcwr1dx.mongodb.net/XCAfrique'

async function addSourcesToArticle() {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.error('❌ Usage: node scripts/addSourcesToArticle.js <slug> [title1] [url1] [title2] [url2] ...')
    console.error('   Exemple: node scripts/addSourcesToArticle.js "mon-article" "Source 1" "https://example.com/1"')
    process.exit(1)
  }

  const slug = args[0]
  const sources = []

  // Parser les arguments (title, url, title, url, ...)
  for (let i = 1; i < args.length; i += 2) {
    const title = args[i]
    const url = args[i + 1]
    
    if (!url) {
      // Si pas d'URL, traiter comme une URL simple
      sources.push({
        title: title,
        url: title
      })
      break
    }
    
    sources.push({
      title: title,
      url: url
    })
  }

  // Si pas de sources fournies, demander interactivement
  if (sources.length === 0) {
    console.log('💡 Aucune source fournie. Format attendu:')
    console.log('   node scripts/addSourcesToArticle.js <slug> "<title1>" "<url1>" "<title2>" "<url2>" ...')
    console.log('')
    console.log('   Ou utilisez MongoDB directement:')
    console.log(`   db.articles.updateOne(`)
    console.log(`     { slug: "${slug}" },`)
    console.log(`     {`)
    console.log(`       $set: {`)
    console.log(`         sources: [`)
    console.log(`           { title: "Nom source", url: "https://example.com" }`)
    console.log(`         ]`)
    console.log(`       }`)
    console.log(`     }`)
    console.log(`   )`)
    process.exit(0)
  }

  let client

  try {
    console.log('🔌 Connexion à MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connecté à MongoDB\n')

    const db = client.db()
    const articlesCollection = db.collection('articles')

    // Vérifier que l'article existe
    const article = await articlesCollection.findOne({ slug: slug })
    
    if (!article) {
      console.error(`❌ Article avec le slug "${slug}" non trouvé`)
      process.exit(1)
    }

    console.log(`📝 Article trouvé: ${article.title}`)
    console.log(`📊 Sources à ajouter: ${sources.length}\n`)

    // Ajouter les sources
    const result = await articlesCollection.updateOne(
      { slug: slug },
      {
        $set: {
          sources: sources,
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount > 0) {
      console.log('✅ Sources ajoutées avec succès!')
      console.log('\n📋 Sources ajoutées:')
      sources.forEach((source, index) => {
        console.log(`   ${index + 1}. ${source.title}`)
        console.log(`      ${source.url}`)
      })
    } else {
      console.log('⚠️  Aucune modification effectuée (les sources étaient peut-être identiques)')
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('\n🔌 Déconnecté de MongoDB')
    }
  }
}

addSourcesToArticle()


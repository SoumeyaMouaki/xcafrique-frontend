import { useParams, Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import CategoryList from '../components/CategoryList'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { extractApiData, handleApiError } from '../utils/apiHelpers'
import API from '../api'
import { useState, useEffect } from 'react'

/**
 * Page Catégories - Affiche les articles par catégorie ou tous les articles
 */
const Categories = () => {
  const { category } = useParams()
  const decodedCategory = category ? decodeURIComponent(category) : null
  const [articles, setArticles] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState(false)

  // Récupérer les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const res = await API.get('/categories')
        const cats = extractApiData(res)
        setAllCategories(cats)
      } catch (err) {
        console.error('Erreur récupération catégories:', handleApiError(err))
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Normaliser un slug (comme le backend)
  const normalizeSlug = (slug) => {
    if (!slug) return ''
    return slug.toString().trim().toLowerCase()
  }

  // Fonction pour récupérer les articles (accessible partout)
  const fetchArticles = async () => {
    if (loadingCategories) return
    
    try {
      setLoading(true)
      setError(false)
      // L'API retourne automatiquement uniquement les articles publiés
      let url = '/articles'
      const params = new URLSearchParams()
      
      if (decodedCategory) {
        // Normaliser le slug de la catégorie (comme le backend)
        const normalizedSlug = normalizeSlug(decodedCategory)
        
        // Chercher la catégorie par slug normalisé ou nom
        const foundCategory = allCategories.find(
          cat => {
            const catSlug = normalizeSlug(cat.slug || '')
            const catName = (cat.name || '').toLowerCase()
            return catSlug === normalizedSlug || 
                   catName === normalizedSlug ||
                   catSlug === decodedCategory ||
                   (cat.name || cat) === decodedCategory
          }
        )
        
        if (foundCategory) {
          // Utiliser le slug de préférence (normalisé comme le backend)
          const categoryFilter = normalizeSlug(foundCategory.slug || foundCategory._id || foundCategory.id)
          params.append('category', categoryFilter)
        } else {
          // Utiliser directement le slug normalisé (le backend le gère maintenant)
          params.append('category', normalizedSlug)
        }
      }
      
      const queryString = params.toString()
      const finalUrl = queryString ? `${url}?${queryString}` : url
      
      const res = await API.get(finalUrl)
      const articlesData = extractApiData(res)
      
      // L'API retourne maintenant toujours 200 avec un tableau vide si pas d'articles
      // Plus besoin de gérer les erreurs 404 pour les catégories vides
      setArticles(articlesData)
      
      // Afficher le message informatif de l'API si disponible
      if (res.data?.message && articlesData.length === 0) {
        console.log('Message API:', res.data.message)
      }
    } catch (err) {
      const apiError = handleApiError(err)
      // Ne pas afficher d'erreur si c'est juste une catégorie vide (l'API retourne 200 maintenant)
      // Seulement pour les vraies erreurs réseau/CORS
      if (apiError.status !== 200 && apiError.status !== 0) {
        console.error('Erreur récupération articles:', apiError)
        setError(true)
      } else {
        // Catégorie vide ou erreur réseau - afficher tableau vide
        setArticles([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedCategory, loadingCategories, allCategories])

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={decodedCategory ? `${decodedCategory} - XCAfrique` : "Catégories - XCAfrique"}
        description={decodedCategory 
          ? `Articles dans la catégorie ${decodedCategory} sur l'actualité aéronautique africaine`
          : "Découvrez tous nos articles sur l'actualité aéronautique africaine par catégorie"
        }
        keywords={decodedCategory ? `${decodedCategory}, aviation, Afrique` : "aviation, Afrique, catégories"}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar avec liste des catégories */}
        <aside className="lg:col-span-1">
          <CategoryList categories={allCategories} />
        </aside>

        {/* Contenu principal */}
        <main className="lg:col-span-3">
          <h1 className="text-4xl font-bold text-primary-dark mb-2">
            {decodedCategory ? decodedCategory : 'Toutes les catégories'}
          </h1>
          <p className="text-gray-600 mb-8">
            {decodedCategory 
              ? `Articles dans la catégorie "${decodedCategory}"`
              : 'Découvrez tous nos articles sur l\'actualité aéronautique africaine'
            }
          </p>

          {loading ? (
            <LoadingSpinner text="Chargement des articles..." />
          ) : error ? (
            <ErrorMessage 
              message="Impossible de charger les articles. Vérifiez que le backend est démarré et que la configuration CORS est correcte." 
              onRetry={fetchArticles}
              isCors={true}
            />
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map(article => (
                <ArticleCard key={article._id || article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg mb-4">
                {decodedCategory 
                  ? `Aucun article trouvé dans la catégorie "${decodedCategory}".` 
                  : 'Aucun article disponible pour le moment.'}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {decodedCategory 
                  ? 'Cette catégorie sera bientôt alimentée avec du contenu.' 
                  : 'Revenez bientôt pour découvrir nos nouveaux articles.'}
              </p>
              {decodedCategory && (
                <Link to="/categories" className="btn-primary inline-block">
                  Voir toutes les catégories
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Categories


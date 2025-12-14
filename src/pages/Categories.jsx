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

  // Récupérer les articles selon la catégorie sélectionnée
  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(false)
      let url = '/articles?status=published'
      if (decodedCategory) {
        // Chercher la catégorie par nom pour obtenir son ID
        const foundCategory = allCategories.find(
          cat => (cat.name || cat) === decodedCategory
        )
        if (foundCategory) {
          const categoryId = foundCategory._id || foundCategory.id
          url += `&category=${categoryId}`
        } else {
          // Fallback: utiliser le nom directement
          url += `&category=${encodeURIComponent(decodedCategory)}`
        }
      }
      
      const res = await API.get(url)
      const articlesData = extractApiData(res)
      setArticles(articlesData)
    } catch (err) {
      console.error('Erreur récupération articles:', handleApiError(err))
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loadingCategories) {
      fetchArticles()
    }
  }, [decodedCategory, loadingCategories])

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
                Aucun article trouvé {decodedCategory ? `dans la catégorie "${decodedCategory}"` : 'pour le moment'}.
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


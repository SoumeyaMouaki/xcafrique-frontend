import { useParams, Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import CategoryList from '../components/CategoryList'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { extractApiData, handleApiError } from '../utils/apiHelpers'
import API from '../api'
import useArticles from '../hooks/useArticles'
import { useState, useEffect, useMemo } from 'react'

/**
 * Page Catégories - Affiche les articles par catégorie ou tous les articles
 */
const Categories = () => {
  const { category } = useParams()
  const decodedCategory = category ? decodeURIComponent(category) : null
  const [allCategories, setAllCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  // Normaliser un slug (comme le backend)
  const normalizeSlug = (slug) => {
    if (!slug) return ''
    return slug.toString().trim().toLowerCase()
  }
  
  // Trouver le slug de catégorie à utiliser pour l'API (mémorisé)
  const categorySlug = useMemo(() => {
    if (!decodedCategory) return undefined
    
    const normalizedSlug = normalizeSlug(decodedCategory)
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
      return normalizeSlug(foundCategory.slug || foundCategory._id || foundCategory.id)
    }
    
    return normalizedSlug
  }, [decodedCategory, allCategories])
  
  // Utiliser le hook useArticles avec le filtre de catégorie
  const { articles, loading, error } = useArticles({
    category: categorySlug,
    limit: 20
  })

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

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={decodedCategory ? `${decodedCategory} - XCAfrique` : "Rubriques - XCAfrique"}
        description={decodedCategory 
          ? `Articles dans la rubrique ${decodedCategory} sur l'actualité aéronautique africaine`
          : "Découvrez tous nos articles sur l'actualité aéronautique africaine par rubrique"
        }
        keywords={decodedCategory ? `${decodedCategory}, aviation, Afrique` : "aviation, Afrique, rubriques"}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar avec liste des rubriques */}
        <aside className="lg:col-span-1">
          <CategoryList categories={allCategories} />
        </aside>

        {/* Contenu principal */}
        <main className="lg:col-span-3">
          <h1 className="text-4xl font-bold text-primary-dark mb-2">
            {decodedCategory ? decodedCategory : 'Toutes les rubriques'}
          </h1>
          <p className="text-gray-600 mb-8">
            {decodedCategory 
              ? `Articles dans la rubrique "${decodedCategory}"`
              : 'Découvrez tous nos articles sur l\'actualité aéronautique africaine'
            }
          </p>

          {loading || loadingCategories ? (
            <LoadingSpinner text="Chargement des articles..." />
          ) : error && error.status !== 404 ? (
            // Afficher l'erreur seulement si ce n'est pas une 404 (catégorie vide)
            <ErrorMessage 
              message={error.message || "Impossible de charger les articles. Vérifiez que le backend est démarré et que la configuration CORS est correcte."} 
              onRetry={() => window.location.reload()}
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
                  ? `Aucun article trouvé dans la rubrique "${decodedCategory}".` 
                  : 'Aucun article disponible pour le moment.'}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {decodedCategory 
                  ? (allCategories.length > 0 && !allCategories.find(cat => {
                      const catSlug = (cat.slug || '').toLowerCase()
                      const catName = (cat.name || '').toLowerCase()
                      const searchSlug = (decodedCategory || '').toLowerCase()
                      return catSlug === searchSlug || catName === searchSlug
                    })
                      ? 'Cette rubrique n\'existe pas ou n\'a pas encore d\'articles publiés.'
                      : 'Cette rubrique sera bientôt alimentée avec du contenu.')
                  : 'Revenez bientôt pour découvrir nos nouveaux articles.'}
              </p>
              {decodedCategory && (
                <Link to="/categories" className="btn-primary inline-block">
                  Voir toutes les rubriques
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


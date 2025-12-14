import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from '../api'
import { extractApiData, handleApiError } from '../utils/apiHelpers'
import ArticleCard from '../components/ArticleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import SEO from '../components/SEO'

/**
 * Page Search - Résultats de recherche
 */
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      performSearch(query)
    } else {
      setArticles([])
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true)
      setError(false)
      const res = await API.get(`/articles?search=${encodeURIComponent(searchQuery)}&status=published`)
      const articlesData = extractApiData(res)
      setArticles(articlesData)
    } catch (err) {
      console.error('Erreur recherche:', handleApiError(err))
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={`Recherche: ${query} - XCAfrique`}
        description={`Résultats de recherche pour "${query}" sur XCAfrique`}
        keywords={`recherche, ${query}, aviation, Afrique`}
      />

      <h1 className="text-4xl font-bold text-primary-dark mb-2">
        Résultats de recherche
      </h1>
      
      {query && (
        <p className="text-gray-600 mb-8">
          Recherche pour : <span className="font-semibold text-primary-dark">"{query}"</span>
        </p>
      )}

      {!query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">
            Entrez un terme de recherche pour trouver des articles
          </p>
        </div>
      ) : loading ? (
        <LoadingSpinner text="Recherche en cours..." />
      ) : error ? (
        <ErrorMessage 
          message="Erreur lors de la recherche. Veuillez réessayer." 
          onRetry={() => performSearch(query)}
        />
      ) : articles.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6">
            {articles.length} {articles.length === 1 ? 'article trouvé' : 'articles trouvés'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article._id || article.id} article={article} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">
            Aucun résultat trouvé pour "<span className="font-semibold">{query}</span>"
          </p>
          <p className="text-gray-500 mb-6">
            Essayez avec d'autres mots-clés ou consultez toutes nos catégories
          </p>
          <Link to="/categories" className="btn-primary inline-block">
            Voir toutes les catégories
          </Link>
        </div>
      )}
    </div>
  )
}

export default Search


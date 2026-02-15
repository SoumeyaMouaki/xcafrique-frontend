import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useArticles from '../hooks/useArticles'
import ArticleCard from '../components/ArticleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import SEO from '../components/SEO'

/**
 * Page Search - Résultats de recherche
 */
const Search = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  // Utiliser le hook useArticles avec le paramètre de recherche
  const { articles, loading, error } = useArticles({
    search: query || undefined,
    limit: 20
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={`${t('search.title')}: ${query} - XCAfrique`}
        description={`${t('search.resultsFor')} "${query}" sur XCAfrique`}
        keywords={`recherche, ${query}, aviation, Afrique`}
      />

      <h1 className="text-4xl font-bold text-primary-dark mb-2">
        {t('search.title')}
      </h1>
      
      {query && (
        <p className="text-gray-600 mb-8">
          {t('search.resultsFor')} : <span className="font-semibold text-primary-dark">"{query}"</span>
        </p>
      )}

      {!query ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">
            {t('search.noResults')}
          </p>
        </div>
      ) : loading ? (
        <LoadingSpinner text={t('common.loading')} />
      ) : error ? (
        <ErrorMessage 
          message={error.message || t('search.error')} 
          onRetry={() => window.location.reload()}
        />
      ) : articles.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6">
            {articles.length} {articles.length === 1 ? t('search.articleFound') : t('search.articlesFound')}
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
            {t('search.noResults')} "<span className="font-semibold">{query}</span>"
          </p>
          <p className="text-gray-500 mb-6">
            {t('search.tryOtherKeywords')}
          </p>
          <Link to="/categories" className="btn-primary inline-block">
            {t('categories.allCategories')}
          </Link>
        </div>
      )}
    </div>
  )
}

export default Search


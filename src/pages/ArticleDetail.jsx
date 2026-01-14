import { useParams, Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { extractApiItem, handleApiError } from '../utils/apiHelpers'
import API, { SITE_URL } from '../api'
import { useState, useEffect } from 'react'

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchArticle = async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      setError(false)
      // L'API utilise le slug, pas l'ID
      const res = await API.get(`/articles/${slug}`)
      const articleData = extractApiItem(res)
      setArticle(articleData)
    } catch (err) {
      console.error('Erreur fetch article:', handleApiError(err))
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticle()
    // scroll to top when opening article
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner text="Chargement de l'article..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage 
          message="Impossible de récupérer l'article. Vérifiez que le backend est démarré et que la configuration CORS est correcte." 
          onRetry={fetchArticle}
          isCors={true}
        />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-3xl font-bold text-primary-dark mb-4">
            Article non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Partage — safe because we returned early if no article
  const shareOnTwitter = () => {
    const url = `${SITE_URL}${window.location.pathname}`
    const text = article.title || 'XC Afrique'
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

  const shareOnFacebook = () => {
    const url = `${SITE_URL}${window.location.pathname}`
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

  const shareOnLinkedIn = () => {
    const url = `${SITE_URL}${window.location.pathname}`
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

  // Gérer l'image (peut être image, featuredImage, etc.)
  const imageSrc = article.image || article.featuredImage
  
  // Gérer la catégorie
  const categoryName = article.category?.name || article.category || 'Général'
  
  // Gérer l'auteur
  const authorName = article.author?.name || article.author || 'Équipe XC Afrique'

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO
        title={`${article.title} - XCAfrique`}
        description={article.excerpt}
        keywords={`${article.category || ''}, aviation, Afrique, aéronautique`}
        image={article.image}
      />

      <button
        onClick={() => navigate(-1)}
        className="text-primary-dark hover:text-primary-light mb-6 flex items-center transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </button>

      {imageSrc && (
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-xl bg-gray-200">
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div className="absolute top-4 left-4">
            <span 
              className="text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryName}
            </span>
          </div>
          {article.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-accent-orange text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ⭐ À la une
              </span>
            </div>
          )}
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{authorName}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(article.createdAt || article.date || article.publishedAt)}</span>
          </div>
        </div>

        {article.excerpt && (
          <p className="text-xl text-gray-700 italic border-l-4 border-accent-orange pl-4 mb-8 bg-gray-50 py-3 rounded-r-lg">
            {article.excerpt}
          </p>
        )}
      </header>

      <div
        className="prose prose-lg max-w-none mb-8 article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Partage & navigation */}
      <div className="border-t border-gray-200 pt-8 mt-8">
        <h3 className="text-lg font-semibold text-primary-dark mb-4">
          Partager cet article
        </h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={shareOnTwitter}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-md hover:shadow-lg"
            aria-label="Partager sur Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
            <span>Twitter</span>
          </button>
          <button
            onClick={shareOnFacebook}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            aria-label="Partager sur Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
            <span>Facebook</span>
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg"
            aria-label="Partager sur LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      {article.category && article.category.slug && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to={`/categories/${encodeURIComponent(article.category.slug)}`}
            className="text-primary-dark hover:text-primary-light font-medium transition-colors flex items-center group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voir plus d'articles dans {categoryName}
          </Link>
        </div>
      )}
    </article>
  )
}

export default ArticleDetail

import { useParams, Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ShareButtons from '../components/ShareButtons'
import { fetchArticleBySlug } from '../services/articles'
import { useState, useEffect } from 'react'

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchArticle = async () => {
    if (!slug) {
      console.error('ArticleDetail: Slug manquant dans l\'URL')
      setError(true)
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(false)
      
      // Décoder le slug de l'URL (React Router le décode automatiquement, mais on s'assure)
      const decodedSlug = decodeURIComponent(slug)
      console.log('ArticleDetail: Récupération de l\'article avec slug:', decodedSlug)
      
      const result = await fetchArticleBySlug(decodedSlug)
      
      if (result.success && result.article) {
        console.log('ArticleDetail: Article récupéré avec succès:', result.article.title)
        setArticle(result.article)
      } else {
        console.error('ArticleDetail: Erreur lors de la récupération:', result.error)
        setError(true)
        setArticle(null)
      }
    } catch (err) {
      console.error('ArticleDetail: Exception lors du fetch:', err)
      setError(true)
      setArticle(null)
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
          message={`Impossible de récupérer l'article avec le slug "${slug}". Vérifiez que le backend est démarré et que l'article existe.`}
          onRetry={fetchArticle}
          isCors={true}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Slug utilisé : <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
          </p>
          <Link to="/" className="btn-primary inline-block">
            Retour à l'accueil
          </Link>
        </div>
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

  // Callback pour mettre à jour le compteur de partages après un partage
  const handleShareUpdate = (newShareCount) => {
    setArticle(prev => ({
      ...prev,
      shareCount: newShareCount
    }))
  }

  // Gérer l'image (peut être image, featuredImage, etc.)
  const imageSrc = article?.image || article?.featuredImage
  
  // Gérer la catégorie (avec vérifications supplémentaires)
  const categoryName = article?.category?.name || article?.category || 'Général'
  
  // Gérer l'auteur
  const authorName = article?.author?.name || article?.author || 'Équipe XC Afrique'

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
              style={{ backgroundColor: article.category?.color || '#1E40AF' }}
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

      {/* Sources */}
      {article.sources && article.sources.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mt-8 mb-8">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Sources
          </h3>
          <ul className="space-y-3">
            {article.sources.map((source, index) => {
              // Gérer les deux formats : objet {title, url} ou string (URL)
              const sourceUrl = typeof source === 'string' ? source : source.url
              const sourceTitle = typeof source === 'string' ? source : (source.title || source.url)
              
              return (
                <li key={index} className="flex items-start">
                  <span className="text-accent-orange mr-2 mt-1">•</span>
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-dark hover:text-accent-orange transition-colors break-words flex-1"
                  >
                    {sourceTitle}
                    <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Partage */}
      <ShareButtons article={article} onShareUpdate={handleShareUpdate} />

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

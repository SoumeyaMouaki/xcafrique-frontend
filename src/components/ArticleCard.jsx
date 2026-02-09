import { Link } from 'react-router-dom'
import useReadArticles from '../hooks/useReadArticles'

/**
 * Composant ArticleCard - Carte d'affichage d'un article
 * Affiche l'image, le titre, l'extrait et un bouton "Lire plus"
 * 
 * @param {Object} article - L'objet article à afficher
 */
const ArticleCard = ({ article }) => {
  const { isRead } = useReadArticles()
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

  // Vérifier que l'article existe
  if (!article) return null
  
  // Gérer la catégorie (peut être un objet ou une string)
  const categoryName = article?.category?.name || article?.category || 'Général'
  const categorySlug = article?.category?.slug || ''
  
  // Gérer l'image (peut être image, featuredImage, etc.)
  const imageUrl = article?.image || article?.featuredImage
  
  // Gérer l'auteur
  const authorName = article?.author?.name || article?.author || 'Équipe XC Afrique'
  
  // Utiliser le slug pour l'URL (selon la documentation API)
  const articleSlug = article?.slug || article?._id || article?.id
  // Encoder le slug pour l'URL (gérer les caractères spéciaux)
  if (!articleSlug) {
    console.warn('ArticleCard: Article sans slug valide:', article)
    return null
  }
  const encodedSlug = encodeURIComponent(String(articleSlug))
  
  // Vérifier si l'article a été lu
  const articleIsRead = isRead(articleSlug)

  return (
    <article className="card group animate-fadeIn">
      {/* Image de l'article */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={article.title || 'Article'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
        {/* Overlay gradient pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Badge catégorie avec couleur */}
        <div className="absolute top-4 left-4 z-10">
          <span 
            className="text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: article.category?.color || '#1E40AF' }}
          >
            {categoryName}
          </span>
        </div>
        {/* Badge featured si applicable */}
        {article.featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-accent-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm animate-pulse">
              ⭐ À la une
            </span>
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        <h2 className={`text-xl font-semibold mb-2 line-clamp-2 transition-colors flex items-start gap-2 ${
          articleIsRead 
            ? 'text-gray-500 line-through group-hover:text-gray-600' 
            : 'text-primary-dark group-hover:text-accent-orange'
        }`}>
          {articleIsRead && (
            <svg 
              className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-label="Article lu"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{article.title}</span>
        </h2>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt || article.description || ''}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {authorName}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(article.createdAt || article.date || article.publishedAt)}
          </span>
        </div>

        {/* Statistiques */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {article.views !== undefined && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.views} vue{article.views > 1 ? 's' : ''}
            </span>
          )}
          {article.shareCount !== undefined && article.shareCount > 0 && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {article.shareCount} partage{article.shareCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Bouton Lire plus */}
        <Link
          to={`/article/${encodedSlug}`}
          className="btn-primary inline-block text-center w-full group/btn"
        >
          <span className="flex items-center justify-center">
            Lire plus
            <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  )
}

export default ArticleCard


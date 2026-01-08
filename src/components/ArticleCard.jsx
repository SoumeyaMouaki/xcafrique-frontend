import { Link } from 'react-router-dom'

/**
 * Composant ArticleCard - Carte d'affichage d'un article
 * Affiche l'image, le titre, l'extrait et un bouton "Lire plus"
 * 
 * @param {Object} article - L'objet article à afficher
 */
const ArticleCard = ({ article }) => {
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

  // Gérer la catégorie (peut être un objet ou une string)
  const categoryName = article.category?.name || article.category || 'Général'
  
  // Gérer l'image (peut être image, featuredImage, etc.)
  const imageUrl = article.image || article.featuredImage
  
  // Gérer l'auteur
  const authorName = article.author?.name || article.author || 'Équipe XC Afrique'
  
  // Utiliser le slug pour l'URL (selon la documentation API)
  const articleSlug = article.slug || article._id || article.id

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
        {/* Badge catégorie */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary-dark text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
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
        <h2 className="text-xl font-semibold mb-2 text-primary-dark line-clamp-2 group-hover:text-accent-orange transition-colors">
          {article.title}
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

        {/* Bouton Lire plus */}
        <Link
          to={`/article/${articleSlug}`}
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


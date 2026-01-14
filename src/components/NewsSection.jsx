import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import API from '../api'
import { extractApiData, handleApiError } from '../utils/apiHelpers'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

/**
 * NewsSection - Grille d'actualités avec 6 articles
 */
const NewsSection = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(false)
        const res = await API.get('/articles?limit=6&page=1')
        const data = extractApiData(res)
        setArticles(data)
      } catch (err) {
        console.error('Erreur récupération articles:', handleApiError(err))
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <LoadingSpinner text="Chargement des actualités..." />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ErrorMessage 
            message="Impossible de charger les actualités" 
            onRetry={() => window.location.reload()}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-primary-dark mb-12 text-center"
        >
          A la Une
        </motion.h2>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun article disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => {
            const categoryName = article.category?.name || article.category || 'Actualité'
            const categoryColor = article.category?.color || '#EA580C' // Couleur par défaut (accent-orange)
            const articleSlug = article.slug || article._id || article.id
            const imageUrl = article.image || article.featuredImage
            const date = article.createdAt || article.date || article.publishedAt

            return (
              <motion.article
                key={article._id || article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
              >
                <Link to={`/article/${articleSlug}`}>
                  {/* Image */}
                  <div className="relative h-[248px] overflow-hidden bg-gray-200">
                    {imageUrl && (
                      <motion.img
                        src={imageUrl}
                        alt={article.title || 'Article'}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    {/* Badge catégorie avec couleur */}
                    <div className="absolute top-4 left-4">
                      <span 
                        className="text-white px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: categoryColor }}
                      >
                        {categoryName}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {date ? new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date non disponible'}
                    </div>

                    {/* Titre */}
                    <h3 className="text-xl font-semibold text-primary-dark mb-3 group-hover:text-accent-orange transition-colors duration-200">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.excerpt || article.description || ''}
                    </p>
                  </div>
                </Link>
              </motion.article>
            )
          })}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsSection


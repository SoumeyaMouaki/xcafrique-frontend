import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import useArticles from '../hooks/useArticles'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

/**
 * Page Videos - Page dédiée aux vidéos avec lecteur
 * Utilise le paramètre type=video pour filtrer les articles vidéo depuis l'API
 */
const Videos = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [selectedVideo, setSelectedVideo] = useState(null)
  
  // Utiliser le hook useArticles avec le filtre type=video
  const { articles: videos, loading, error } = useArticles({
    type: 'video',
    limit: 50
  })

  // Sélectionner automatiquement la vidéo depuis l'URL si présente
  useEffect(() => {
    const videoParam = searchParams.get('video')
    if (videoParam && videos.length > 0 && !selectedVideo) {
      // Trouver la vidéo correspondante au paramètre
      const video = videos.find(
        v => (v.slug && v.slug === videoParam) || 
             (v._id && v._id === videoParam) || 
             (v.id && v.id === videoParam)
      )
      if (video) {
        setSelectedVideo(video)
        // Scroll vers le lecteur vidéo
        setTimeout(() => {
          const videoPlayer = document.querySelector('.aspect-video')
          if (videoPlayer) {
            videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
        }, 100)
      }
    }
  }, [searchParams, videos, selectedVideo])

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${t('videos.title')} - XCAfrique`}
        description="Découvrez nos vidéos sur l'actualité aéronautique africaine : analyses, reportages et interviews."
        keywords="videos, aviation, Afrique, reportages, interviews"
      />

      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-primary-dark mb-8 text-center"
        >
          {t('videos.featured')}
        </motion.h1>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner text={t('videos.loading')} />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-12">
            <ErrorMessage 
              message={error.message || t('videos.error')} 
              onRetry={() => window.location.reload()}
            />
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('videos.noVideos')}</p>
          </div>
        )}

        {/* Lecteur vidéo principal */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-12"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video bg-black">
                {selectedVideo.videoEmbedUrl ? (
                  <div className="video-container" style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    maxWidth: '100%'
                  }}>
                <iframe
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                      }}
                      src={selectedVideo.videoEmbedUrl}
                      title={selectedVideo.title || 'Vidéo'}
                      frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <p>{t('videos.videoNotAvailable')}</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary-dark mb-2">
                  {selectedVideo.title}
                </h2>
                <p className="text-gray-600 mb-4">{selectedVideo.excerpt || selectedVideo.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {selectedVideo.category && (
                    <span 
                      className="text-white px-3 py-1 rounded-full"
                      style={{ backgroundColor: selectedVideo.category?.color || '#EA580C' }}
                    >
                      {selectedVideo.category?.name || selectedVideo.category}
                    </span>
                  )}
                  {selectedVideo.author && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {selectedVideo.author}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grille de vidéos */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
            <motion.div
              key={video._id || video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {video.featuredImage && (
                  <img
                    src={video.featuredImage}
                    alt={video.title || 'Vidéo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-accent-orange rounded-full p-4"
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
                {video.category && (
                  <div className="absolute top-2 left-2">
                    <span 
                      className="text-white px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: video.category?.color || '#EA580C' 
                      }}
                    >
                      {video.category?.name || video.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary-dark mb-2 group-hover:text-accent-orange transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.excerpt || video.description || ''}
                </p>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Videos


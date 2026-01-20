import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useArticles from '../hooks/useArticles'
import LoadingSpinner from './LoadingSpinner'

/**
 * VideosSection - Carrousel de vidéos interactif
 * Utilise le paramètre type=video pour récupérer les articles vidéo depuis l'API
 */
const VideosSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Utiliser le hook useArticles avec le filtre type=video
  const { articles: videos, loading } = useArticles({
    type: 'video',
    limit: 6
  })

  const nextVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }
  }

  const prevVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
    }
  }

  // Afficher 3 vidéos à la fois sur desktop
  const visibleVideos = []
  if (videos.length > 0) {
    for (let i = 0; i < Math.min(3, videos.length); i++) {
      const index = (currentIndex + i) % videos.length
      visibleVideos.push(videos[index])
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-primary-dark text-white">
        <div className="container mx-auto px-4">
          <LoadingSpinner text="Chargement des vidéos..." />
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-primary-dark text-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          Featured Videos
        </motion.h2>

        <div className="relative">
          {/* Boutons navigation desktop */}
          <button
            onClick={prevVideo}
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            aria-label="Previous video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carrousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {visibleVideos.map((video, index) => (
                <motion.div
                  key={video._id || video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden rounded-lg">
                    {video.featuredImage && (
                      <motion.img
                        src={video.featuredImage}
                        alt={video.title || 'Vidéo'}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    {/* Overlay sombre */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors"></div>
                    
                    {/* Bouton Play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-accent-orange rounded-full p-4"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-accent-orange transition-colors">
                    {video.title}
                  </h3>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bouton navigation droite desktop */}
          <button
            onClick={nextVideo}
            className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            aria-label="Next video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Navigation mobile */}
        <div className="flex justify-center gap-2 mt-8 lg:hidden">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-accent-orange' : 'bg-white/30'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideosSection


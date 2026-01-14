import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import API from '../api'
import { extractApiData } from '../utils/apiHelpers'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

/**
 * Page Videos - Page dédiée aux vidéos avec lecteur
 */
const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(false)
        const res = await API.get('/videos')
        const videosData = extractApiData(res)
        setVideos(videosData)
      } catch (err) {
        setError(true)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Videos - XCAfrique"
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
          Featured Videos
        </motion.h1>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Chargement des vidéos..." />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-12">
            <ErrorMessage 
              message="Impossible de charger les vidéos" 
              onRetry={() => window.location.reload()}
            />
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune vidéo disponible pour le moment.</p>
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
                <iframe
                  src={selectedVideo.videoUrl || selectedVideo.url || selectedVideo.embedUrl}
                  title={selectedVideo.title || selectedVideo.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary-dark mb-2">
                  {selectedVideo.title || selectedVideo.name}
                </h2>
                <p className="text-gray-600 mb-4">{selectedVideo.description || selectedVideo.excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {selectedVideo.category && (
                    <span className="bg-accent-orange text-white px-3 py-1 rounded-full">
                      {selectedVideo.category?.name || selectedVideo.category}
                    </span>
                  )}
                  {selectedVideo.duration && <span>{selectedVideo.duration}</span>}
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
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title || video.name || 'Vidéo'}
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
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
                    {video.duration}
                  </div>
                )}
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
                  {video.title || video.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description || video.excerpt || ''}
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


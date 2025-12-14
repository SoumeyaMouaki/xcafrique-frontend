import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'

/**
 * Page Videos - Page dédiée aux vidéos avec lecteur
 */
const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)

  // Données de vidéos (à remplacer par des données API)
  const videos = [
    {
      id: 1,
      title: 'Ethiopian Airlines Expansion Strategy',
      description: 'Analyse approfondie de la stratégie d\'expansion d\'Ethiopian Airlines en Afrique et au-delà.',
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=450&fit=crop',
      duration: '5:32',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Remplacez par une vraie URL
      category: 'Fleet',
    },
    {
      id: 2,
      title: 'Lagos Airport Modernization Project',
      description: 'Reportage sur le projet de modernisation de l\'aéroport de Lagos, un hub majeur en Afrique de l\'Ouest.',
      thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=450&fit=crop',
      duration: '8:15',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Infrastructure',
    },
    {
      id: 3,
      title: 'Pilot Training Programs in Africa',
      description: 'Découverte des programmes de formation des pilotes en Afrique et des défis à relever.',
      thumbnail: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=450&fit=crop',
      duration: '6:42',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Training',
    },
    {
      id: 4,
      title: 'Air Safety Regulations Update',
      description: 'Mise à jour sur les nouvelles réglementations de sécurité aérienne en Afrique.',
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=450&fit=crop',
      duration: '4:28',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Safety',
    },
    {
      id: 5,
      title: 'Cargo Aviation Growth in Africa',
      description: 'Analyse de la croissance du transport de fret aérien sur le continent africain.',
      thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=450&fit=crop',
      duration: '7:20',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Cargo',
    },
    {
      id: 6,
      title: 'Technology Innovation in African Aviation',
      description: 'Les innovations technologiques qui transforment l\'aviation africaine.',
      thumbnail: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=450&fit=crop',
      duration: '9:10',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Technology',
    },
  ]

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
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary-dark mb-2">
                  {selectedVideo.title}
                </h2>
                <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="bg-accent-orange text-white px-3 py-1 rounded-full">
                    {selectedVideo.category}
                  </span>
                  <span>{selectedVideo.duration}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grille de vidéos */}
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
              <div className="relative h-48 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-accent-orange text-white px-2 py-1 rounded text-xs font-semibold">
                    {video.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary-dark mb-2 group-hover:text-accent-orange transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Videos


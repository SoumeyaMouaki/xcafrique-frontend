import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * HeroSection - Section héro avec image de fond, overlay et animations
 */
const HeroSection = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop"
          alt="Aviation africaine"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient bleu foncé */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary-dark/70"></div>
      </div>

      {/* Contenu */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Air News Cross-Checked
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Votre source d'information fiable sur l'actualité aéronautique africaine. 
            Couverture complète de l'industrie avec analyses approfondies et vérifications rigoureuses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/categories"
                className="inline-block bg-accent-orange text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                Lire les dernières actualités
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/follow"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-dark transition-colors duration-200"
              >
                S'abonner
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection


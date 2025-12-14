import { motion } from 'framer-motion'
import useNewsletterStats from '../hooks/useNewsletterStats'
import LoadingSpinner from './LoadingSpinner'

/**
 * NewsletterStats - Composant pour afficher les statistiques de la newsletter
 */
const NewsletterStats = ({ className = '' }) => {
  const { stats, refetch } = useNewsletterStats()

  if (stats.loading) {
    return (
      <div className={`${className}`}>
        <LoadingSpinner size="sm" text="Chargement des statistiques..." />
      </div>
    )
  }

  if (stats.error) {
    return (
      <div className={`${className} bg-red-50 border border-red-200 rounded-lg p-4`}>
        <p className="text-red-700 text-sm">{stats.error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    )
  }

  const confirmationRate = stats.total > 0 
    ? Math.round((stats.confirmed / stats.total) * 100) 
    : 0

  return (
    <div className={`${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary-dark">
            Statistiques Newsletter
          </h3>
          <button
            onClick={refetch}
            className="text-gray-400 hover:text-primary-dark transition-colors"
            aria-label="Actualiser les statistiques"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary-dark to-primary-light rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total d'abonnés</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Confirmés */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Confirmés</p>
                <p className="text-3xl font-bold">{stats.confirmed}</p>
                <p className="text-xs opacity-75 mt-1">{confirmationRate}%</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Non confirmés */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">En attente</p>
                <p className="text-3xl font-bold">{stats.unconfirmed}</p>
                <p className="text-xs opacity-75 mt-1">
                  {stats.total > 0 ? Math.round((stats.unconfirmed / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Barre de progression */}
        {stats.total > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Taux de confirmation</span>
              <span className="font-semibold">{confirmationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confirmationRate}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default NewsletterStats


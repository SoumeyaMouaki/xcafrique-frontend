import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import NewsletterStats from '../components/NewsletterStats'

/**
 * Page Dashboard - Tableau de bord avec statistiques de la newsletter
 */
const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <SEO
        title="Dashboard - XCAfrique"
        description="Tableau de bord avec les statistiques de la newsletter XCAfrique"
        keywords="dashboard, statistiques, newsletter, XCAfrique"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary-dark mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mb-8">
          Statistiques et informations sur la newsletter XCAfrique
        </p>

        {/* Statistiques Newsletter */}
        <div className="mb-8">
          <NewsletterStats />
        </div>

        {/* Section Informations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">
            À propos des statistiques
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Les statistiques sont mises à jour automatiquement toutes les 30 secondes.
              Vous pouvez également cliquer sur l'icône de rafraîchissement pour actualiser manuellement.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Total d'abonnés</strong> : Nombre total de personnes ayant soumis leur email</li>
              <li><strong>Confirmés</strong> : Nombre d'abonnés ayant confirmé leur email</li>
              <li><strong>En attente</strong> : Nombre d'abonnés n'ayant pas encore confirmé leur email</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard


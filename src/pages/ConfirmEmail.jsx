import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import API from '../api'

/**
 * Page ConfirmEmail - Confirmation de l'email pour la newsletter
 * Route: /confirm-email?token=xxx
 */
const ConfirmEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error' | 'expired'
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Token de confirmation manquant.')
        return
      }

      try {
        const response = await API.post('/newsletter/confirm', { token })
        
        // Gérer différents formats de réponse
        const responseData = response.data?.data || response.data || {}
        
        setStatus('success')
        setEmail(responseData.email || '')
        setMessage(responseData.message || 'Votre email a été confirmé avec succès !')
        
        // Rediriger vers la page d'accueil après 5 secondes
        setTimeout(() => {
          navigate('/')
        }, 5000)
      } catch (error) {
        console.error('Erreur confirmation email:', error)
        
        const errorCode = error.response?.data?.error || error.response?.status
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la confirmation.'
        
        if (errorCode === 'TOKEN_EXPIRED' || errorCode === 410) {
          setStatus('expired')
          setMessage('Ce lien de confirmation a expiré. Veuillez vous réabonner.')
        } else if (errorCode === 'TOKEN_INVALID' || errorCode === 400) {
          setStatus('error')
          setMessage('Lien de confirmation invalide.')
        } else {
          setStatus('error')
          setMessage(errorMessage)
        }
      }
    }

    confirmEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-blue-900 flex items-center justify-center px-4 py-12">
      <SEO
        title="Confirmation email - XCAfrique"
        description="Confirmez votre abonnement à la newsletter XCAfrique"
        keywords="confirmation, email, newsletter, XCAfrique"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <div className="mb-6">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent-orange"></div>
            </div>
            <h1 className="text-2xl font-bold text-primary-dark mb-4">
              Confirmation en cours...
            </h1>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous confirmons votre email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary-dark mb-4">
              Email confirmé avec succès !
            </h1>
            {email && (
              <p className="text-gray-700 mb-4">
                <strong>{email}</strong> a été confirmé.
              </p>
            )}
            <p className="text-gray-600 mb-6">
              {message || 'Vous recevrez désormais nos newsletters à cette adresse.'}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Vous serez redirigé vers la page d'accueil dans quelques secondes...
              </p>
            </div>
            <Link
              to="/"
              className="inline-block bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              Retour à l'accueil
            </Link>
          </>
        )}

        {status === 'expired' && (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
                <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary-dark mb-4">
              Lien expiré
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <Link
              to="/subscribe"
              className="inline-block bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              S'abonner à nouveau
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary-dark mb-4">
              Erreur de confirmation
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                to="/subscribe"
                className="block bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
              >
                Réessayer
              </Link>
              <Link
                to="/contact"
                className="block text-primary-dark hover:text-accent-orange transition-colors duration-200"
              >
                Contacter le support
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default ConfirmEmail


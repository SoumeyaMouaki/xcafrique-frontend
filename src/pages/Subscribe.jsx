import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import API from '../api'

/**
 * Page Subscribe - Page dédiée à l'abonnement newsletter et suivi sur les réseaux sociaux
 */
const Subscribe = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('')

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrorMsg('Veuillez entrer votre adresse email.')
      setSubmitStatus('error')
      return
    }

    if (!validateEmail(email)) {
      setErrorMsg('Veuillez fournir une adresse email valide.')
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMsg('')

    try {
      // Envoyer l'abonnement à l'API
      const response = await API.post('/newsletter/subscribe', {
        email: email.trim(),
        name: name.trim() || undefined,
        source: 'website'
      })
      
      // Vérifier la structure de la réponse
      const responseData = response.data?.data || response.data || {}
      
      // Log pour débogage (à retirer en production si nécessaire)
      console.log('✅ Abonnement newsletter - Réponse API:', {
        success: response.data?.success,
        message: response.data?.message,
        data: responseData,
        confirmationRequired: responseData.confirmationRequired
      })
      
      // Vérifier si l'abonnement a réussi
      if (response.data?.success !== false) {
        setSubmitStatus('success')
        setEmail('')
        setName('')
        
        // Réinitialiser le message après 8 secondes (plus de temps pour lire)
        setTimeout(() => setSubmitStatus(null), 8000)
      } else {
        // Le backend a retourné success: false
        const errorMessage = response.data?.message || 'Impossible de vous abonner pour le moment.'
        setErrorMsg(errorMessage)
        setSubmitStatus('error')
      }
    } catch (err) {
      // Log détaillé pour débogage
      console.error('❌ Erreur abonnement newsletter:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        baseURL: err.config?.baseURL
      })
      
      // Gérer les différents types d'erreurs
      const errorCode = err.response?.data?.error
      const errorMessage = err.response?.data?.message
      const statusCode = err.response?.status
      
      let userMessage = 'Impossible de vous abonner pour le moment. Veuillez réessayer plus tard.'
      
      if (errorCode === 'EMAIL_ALREADY_SUBSCRIBED' || statusCode === 409) {
        userMessage = 'Cet email est déjà abonné à notre newsletter. Vérifiez votre boîte mail (et les spams) pour le lien de confirmation.'
      } else if (errorCode === 'INVALID_EMAIL' || statusCode === 400) {
        userMessage = 'Adresse email invalide. Veuillez vérifier votre email.'
      } else if (statusCode === 404) {
        userMessage = 'Service d\'abonnement non disponible. Veuillez réessayer plus tard ou contactez-nous.'
        console.error('⚠️ Endpoint /newsletter/subscribe non trouvé (404). Vérifiez que le backend est bien démarré et que l\'URL est correcte.')
      } else if (statusCode === 500) {
        userMessage = 'Erreur serveur. Veuillez réessayer plus tard ou contactez-nous si le problème persiste.'
      } else if (errorMessage) {
        userMessage = errorMessage
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || err.code === 'ERR_CONNECTION_REFUSED') {
        userMessage = 'Le backend n\'est pas accessible. Assurez-vous que le serveur backend est démarré sur http://localhost:5000'
        console.error('⚠️ Erreur de connexion au backend:', {
          code: err.code,
          message: err.message,
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          suggestion: 'Démarrez le backend avec: npm run dev (dans le dossier backend)'
        })
      }
      
      setErrorMsg(userMessage)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      href: 'https://www.instagram.com/xcafrique/',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      name: 'Twitter / X',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: 'https://twitter.com/xcafrique',
      color: 'from-blue-400 to-blue-600',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700'
    },
    {
      name: 'TikTok',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      href: 'https://www.tiktok.com/@xcafrique?lang=fr',
      color: 'from-black to-gray-800',
      hoverColor: 'hover:from-gray-900 hover:to-black'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: 'https://linkedin.com/company/xcafrique',
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'hover:from-blue-700 hover:to-blue-900'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-blue-900">
      <SEO
        title="S'abonner - XCAfrique"
        description="Abonnez-vous à la newsletter XCAfrique et suivez-nous sur les réseaux sociaux pour ne rien manquer de l'actualité aéronautique africaine."
        keywords="abonnement, newsletter, XCAfrique, réseaux sociaux, aviation africaine"
      />

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Rejoignez la communauté XCAfrique
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Restez informé de l'actualité aéronautique africaine et suivez-nous sur tous nos réseaux sociaux
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter Subscription Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-accent-orange/10 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-dark">Newsletter</h2>
                  <p className="text-gray-600 text-sm">Recevez nos actualités par email</p>
                </div>
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6"
                >
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-medium block mb-1">✅ Abonnement réussi !</span>
                      <span className="text-sm block">
                        Vérifiez votre boîte mail <strong>(et votre dossier spam/courrier indésirable)</strong> et cliquez sur le lien de confirmation pour activer votre abonnement.
                      </span>
                      <span className="text-xs block mt-2 text-green-600">
                        💡 Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam ou contactez-nous.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && errorMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{errorMsg}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom (optionnel)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-accent-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-lg hover:shadow-xl ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Abonnement en cours...
                    </span>
                  ) : (
                    "S'abonner à la newsletter"
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                En vous abonnant, vous acceptez de recevoir nos emails à l'adresse{' '}
                <a href="mailto:news@xcafrique.org" className="text-accent-orange hover:underline">
                  news@xcafrique.org
                </a>
              </p>
            </motion.div>

            {/* Social Media Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-primary-dark/10 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-dark">Réseaux sociaux</h2>
                  <p className="text-gray-600 text-sm">Suivez-nous partout</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Rejoignez notre communauté sur les réseaux sociaux pour ne rien manquer de l'actualité aéronautique africaine.
              </p>

              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${social.color} text-white shadow-lg ${social.hoverColor} transition-all duration-300 group`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                        {social.icon}
                      </div>
                      <span className="font-semibold text-lg">{social.name}</span>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong className="text-primary-dark">Astuce :</strong> Suivez-nous sur tous nos réseaux pour un accès exclusif aux dernières actualités et analyses.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center text-white hover:text-accent-orange transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l'accueil
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Subscribe


import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Bannière de consentement aux cookies - Conforme RGPD
 * Affiche une bannière pour demander le consentement avant d'activer Google Analytics
 */
const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [cookieConsent, setCookieConsent] = useState(null)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookieConsent')
    if (consent === null) {
      // Aucun consentement enregistré, afficher la bannière
      setShowBanner(true)
    } else {
      setCookieConsent(consent === 'accepted')
      // Si le consentement a été donné, charger Google Analytics
      if (consent === 'accepted') {
        loadGoogleAnalytics()
      }
    }
  }, [])

  const loadGoogleAnalytics = () => {
    // Charger Google Analytics seulement si pas déjà chargé
    if (typeof window.gtag === 'undefined') {
      // Créer le script Google Analytics
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-MDFBKZVDYM'
      document.head.appendChild(script1)

      // Initialiser gtag
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', 'G-MDFBKZVDYM', {
        anonymize_ip: true, // Anonymiser les IP pour le RGPD
      })
    }
  }

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setCookieConsent(true)
    setShowBanner(false)
    loadGoogleAnalytics()
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setCookieConsent(false)
    setShowBanner(false)
    // Ne pas charger Google Analytics
  }

  if (!showBanner) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t-2 border-primary-dark"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                🍪 Gestion des cookies
              </h3>
              <p className="text-gray-700 text-sm mb-2">
                Nous utilisons des cookies pour améliorer votre expérience de navigation, analyser le trafic de notre site et afficher des publicités personnalisées. 
                En cliquant sur "Accepter", vous consentez à l'utilisation de cookies à des fins d'analyse (Google Analytics) et de publicité (Google AdSense).
              </p>
              <p className="text-gray-600 text-xs">
                Vous pouvez en savoir plus dans notre{' '}
                <Link 
                  to="/privacy" 
                  className="text-primary-dark hover:text-accent-orange underline font-medium"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
              >
                Refuser
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-primary-dark text-white rounded-lg font-medium hover:bg-primary-light transition-colors whitespace-nowrap"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieBanner


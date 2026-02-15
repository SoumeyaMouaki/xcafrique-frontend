import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Composant pour suivre les changements de route avec Google Analytics
 * Envoie un événement page_view à chaque changement de route
 */
function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Vérifier le consentement aux cookies avant d'envoyer des données
    const cookieConsent = localStorage.getItem('cookieConsent')
    
    // Vérifier que gtag est disponible ET que le consentement a été donné
    if (
      typeof window !== 'undefined' && 
      typeof window.gtag === 'function' && 
      cookieConsent === 'accepted'
    ) {
      // Envoyer l'événement page_view à Google Analytics
      window.gtag('config', 'G-MDFBKZVDYM', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        anonymize_ip: true, // Anonymiser les IP pour le RGPD
      })
    }
  }, [location])

  return null // Ce composant ne rend rien
}

export default GoogleAnalytics


import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Composant pour suivre les changements de route avec Google Analytics
 * Envoie un événement page_view à chaque changement de route
 */
function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Vérifier que gtag est disponible (chargé depuis index.html)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Envoyer l'événement page_view à Google Analytics
      window.gtag('config', 'G-MDFBKZVDYM', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      })
    }
  }, [location])

  return null // Ce composant ne rend rien
}

export default GoogleAnalytics


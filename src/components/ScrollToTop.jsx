import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Composant ScrollToTop - Remonte automatiquement en haut de la page lors de la navigation
 * Utilise useLocation pour détecter les changements de route
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Remonter en haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Animation douce
    })
  }, [pathname])

  return null
}

export default ScrollToTop


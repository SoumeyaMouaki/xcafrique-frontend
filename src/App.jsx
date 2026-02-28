import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header'
import Footer from './components/Footer'
import NotificationContainer from './components/NotificationContainer'
import CookieBanner from './components/CookieBanner'
import GoogleAnalytics from './components/GoogleAnalytics'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Categories from './pages/Categories'
import ArticleDetail from './pages/ArticleDetail'
import Videos from './pages/Videos'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import Follow from './pages/Follow'
import Privacy from './pages/Privacy'

/**
 * Composant principal de l'application
 * Configure le routing et la structure générale de la page
 */
function App() {
  const { i18n } = useTranslation()
  
  // Mettre à jour l'attribut lang du HTML quand la langue change
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  // Empêcher le focus automatique sur les inputs au chargement
  useEffect(() => {
    // Retirer le focus de tout élément qui pourrait l'avoir
    const removeAutoFocus = () => {
      const activeElement = document.activeElement
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur()
      }
    }

    // Exécuter immédiatement et après un court délai
    removeAutoFocus()
    setTimeout(removeAutoFocus, 100)
    setTimeout(removeAutoFocus, 500)

    // Écouter les changements de route pour retirer le focus
    const handleRouteChange = () => {
      setTimeout(removeAutoFocus, 100)
    }

    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])


  return (
    <Router>
      {/* Scroll to top lors de la navigation */}
      <ScrollToTop />
      {/* Google Analytics - Suivi des changements de route */}
      <GoogleAnalytics />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:category" element={<Categories />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/follow" element={<Follow />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
        {/* Container de notifications en temps réel */}
        <NotificationContainer />
        {/* Bannière de consentement aux cookies */}
        <CookieBanner />
      </div>
      {/* Vercel Analytics */}
      <Analytics />
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </Router>
  )
}

export default App


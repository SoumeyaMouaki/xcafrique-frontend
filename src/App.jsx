import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import NotificationContainer from './components/NotificationContainer'
import { initNotificationConnection, closeNotificationConnection } from './services/notificationService'
import Home from './pages/Home'
import Categories from './pages/Categories'
import ArticleDetail from './pages/ArticleDetail'
import Videos from './pages/Videos'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import Subscribe from './pages/Subscribe'
import Dashboard from './pages/Dashboard'
import ConfirmEmail from './pages/ConfirmEmail'

/**
 * Composant principal de l'application
 * Configure le routing et la structure générale de la page
 */
function App() {
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

  // Initialiser la connexion pour les notifications en temps réel
  useEffect(() => {
    // Attendre un peu que l'application soit complètement chargée
    const timer = setTimeout(() => {
      initNotificationConnection()
    }, 1000)

    return () => {
      clearTimeout(timer)
      closeNotificationConnection()
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:category" element={<Categories />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
          </Routes>
        </main>
        <Footer />
        {/* Container de notifications en temps réel */}
        <NotificationContainer />
      </div>
    </Router>
  )
}

export default App


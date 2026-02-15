import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import API from '../api'
// import LanguageSwitcher from './LanguageSwitcher' // Masqué temporairement

/**
 * Header - En-tête sticky avec logo, navigation, recherche et menu mobile
 */
const Header = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsPosition, setSuggestionsPosition] = useState({ top: 0, left: 0, width: 0 })
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Récupérer les suggestions depuis l'API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          setLoadingSuggestions(true)
          
          // Essayer différents endpoints possibles
          let res = null
          let suggestionsData = []
          
          // Essayer d'abord /articles/suggestions
          try {
            res = await API.get(`/articles/suggestions?q=${encodeURIComponent(searchQuery.trim())}`)
          } catch (err) {
            // Si 404, essayer /search/suggestions
            if (err.response?.status === 404) {
              try {
                res = await API.get(`/search/suggestions?q=${encodeURIComponent(searchQuery.trim())}`)
              } catch (err2) {
                // Si encore 404, essayer /suggestions
                if (err2.response?.status === 404) {
                  try {
                    res = await API.get(`/suggestions?q=${encodeURIComponent(searchQuery.trim())}`)
                  } catch (err3) {
                    console.warn('Aucun endpoint de suggestions trouvé. Vérifiez la configuration du backend.')
                    setSuggestions([])
                    setShowSuggestions(false)
                    setLoadingSuggestions(false)
                    return
                  }
                } else {
                  throw err2
                }
              }
            } else {
              throw err
            }
          }
          
          // Essayer différentes structures de réponse
          // Cas 1: { suggestions: [...] }
          if (res.data?.suggestions && Array.isArray(res.data.suggestions)) {
            suggestionsData = res.data.suggestions
          }
          // Cas 2: { data: { suggestions: [...] } }
          else if (res.data?.data?.suggestions && Array.isArray(res.data.data.suggestions)) {
            suggestionsData = res.data.data.suggestions
          }
          // Cas 3: { data: [...] }
          else if (res.data?.data && Array.isArray(res.data.data)) {
            suggestionsData = res.data.data
          }
          // Cas 4: directement un tableau
          else if (Array.isArray(res.data)) {
            suggestionsData = res.data
          }
          // Cas 5: { suggestions: "string" } ou autre format
          else if (res.data?.suggestions) {
            suggestionsData = Array.isArray(res.data.suggestions) 
              ? res.data.suggestions 
              : [res.data.suggestions]
          }
          
          setSuggestions(suggestionsData)
          setShowSuggestions(suggestionsData.length > 0)
          
          // Calculer la position pour le dropdown fixed
          if (inputRef.current && suggestionsData.length > 0) {
            const rect = inputRef.current.getBoundingClientRect()
            setSuggestionsPosition({
              top: rect.bottom + window.scrollY + 8,
              left: rect.left + window.scrollX,
              width: rect.width
            })
          }
        } catch (err) {
          // Ne pas afficher d'erreur si c'est juste un 404 (endpoint non disponible)
          if (err.response?.status !== 404) {
            console.error('Erreur récupération suggestions:', err)
            console.error('Détails erreur:', err.response?.data || err.message)
          }
          setSuggestions([])
          setShowSuggestions(false)
        } finally {
          setLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    // Délai pour éviter trop de requêtes
    const timeoutId = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Mettre à jour la position des suggestions lors du scroll
  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current && showSuggestions && suggestions.length > 0) {
        const rect = inputRef.current.getBoundingClientRect()
        setSuggestionsPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width
        })
      }
    }

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [showSuggestions, suggestions])

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(suggestion)}`)
    setIsSearchOpen(false)
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/categories', label: t('nav.categories') },
    { to: '/videos', label: t('nav.videos') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="bg-primary-dark shadow-lg sticky top-0 z-50" style={{ zIndex: 1000 }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-white">
                XC Afrique
              </span>
              <span className="text-sm md:text-base text-white font-normal hidden md:block">
                Air News Cross-Checked
              </span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.to}-${index}`}
                to={link.to}
                className="text-white hover:text-accent-orange transition-colors duration-200 font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-orange group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher - Masqué temporairement */}
            {/* <LanguageSwitcher /> */}
            
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-accent-orange transition-colors p-2"
              aria-label={t('nav.search')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Hamburger Menu */}
            <button
              className="lg:hidden text-white focus:outline-none"
              onClick={toggleMenu}
              aria-label={t('nav.menu')}
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="py-4 border-t border-white/20 relative" ref={searchRef} style={{ zIndex: 9999, position: 'relative' }}>
                <form onSubmit={handleSearch} className="flex gap-2 relative" style={{ zIndex: 10000 }}>
                  <div className="flex-1 relative" style={{ zIndex: 10001 }}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() => {
                        if (suggestions.length > 0) {
                          setShowSuggestions(true)
                          // Recalculer la position
                          if (inputRef.current) {
                            const rect = inputRef.current.getBoundingClientRect()
                            setSuggestionsPosition({
                              top: rect.bottom + window.scrollY + 8,
                              left: rect.left + window.scrollX,
                              width: rect.width
                            })
                          }
                        }
                      }}
                      placeholder={t('nav.searchPlaceholder')}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white/20 relative"
                    />
                    
                    {/* Suggestions dropdown - Utilise position fixed pour être au-dessus de tout */}
                    <AnimatePresence>
                      {showSuggestions && (searchQuery.trim().length >= 2) && (
                        <motion.div
                          ref={suggestionsRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 max-h-80 overflow-y-auto"
                          style={{ 
                            position: 'fixed',
                            top: `${suggestionsPosition.top}px`,
                            left: `${suggestionsPosition.left}px`,
                            width: `${suggestionsPosition.width || 400}px`,
                            zIndex: 999999,
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                            minWidth: '300px',
                            maxWidth: '600px'
                          }}
                        >
                          {loadingSuggestions ? (
                            <div className="p-4 text-center text-gray-600">
                              <div className="inline-block w-6 h-6 border-3 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
                              <span className="ml-3 text-sm font-medium">{t('search.loadingSuggestions')}</span>
                            </div>
                          ) : suggestions.length > 0 ? (
                            <div className="py-2">
                              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                  {t('search.suggestions')} ({suggestions.length})
                                </p>
                              </div>
                              <ul>
                                {suggestions.map((suggestion, index) => {
                                  // Gérer si suggestion est un objet avec un champ title ou name
                                  const suggestionText = typeof suggestion === 'string' 
                                    ? suggestion 
                                    : suggestion?.title || suggestion?.name || suggestion?.text || String(suggestion)
                                  
                                  return (
                                    <li key={index} className="border-b border-gray-100 last:border-b-0">
                                      <button
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestionText)}
                                        className="w-full text-left px-4 py-3 hover:bg-accent-orange/10 hover:text-accent-orange transition-all duration-200 text-gray-800 flex items-center group"
                                      >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-accent-orange/20 flex items-center justify-center mr-3 transition-colors">
                                          <svg className="w-4 h-4 text-gray-500 group-hover:text-accent-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                          </svg>
                                        </div>
                                        <span className="font-medium text-sm flex-1">{suggestionText}</span>
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-accent-orange opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </button>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          ) : searchQuery.trim().length >= 2 && !loadingSuggestions ? (
                            <div className="p-6 text-center">
                              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <p className="text-gray-500 text-sm font-medium">
                                {t('search.noSuggestions')}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {t('search.tryOtherKeywords')}
                              </p>
                            </div>
                          ) : null}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="submit"
                    className="bg-accent-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    {t('common.search')}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-white/20"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={`${link.to}-${index}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      className="block py-2 px-4 text-white hover:text-accent-orange hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header

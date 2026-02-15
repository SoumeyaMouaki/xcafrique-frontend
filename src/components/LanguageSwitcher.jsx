import React from 'react'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * LanguageSwitcher - Composant pour changer la langue (FR/EN)
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const FlagFR = () => (
    <svg className="w-5 h-5" viewBox="0 0 640 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_fr)">
        <path d="M0 0H213.3V480H0V0Z" fill="#ED2939"/>
        <path d="M213.3 0H426.7V480H213.3V0Z" fill="#FFFFFF"/>
        <path d="M426.7 0H640V480H426.7V0Z" fill="#002654"/>
      </g>
      <defs>
        <clipPath id="clip0_fr">
          <rect width="640" height="480" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )

  const FlagGB = () => (
    <svg className="w-5 h-5" viewBox="0 0 640 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="a_gb">
          <path fillOpacity=".7" d="M-85.3 0h682.6v512h-682.6z"/>
        </clipPath>
      </defs>
      <g clipPath="url(#a_gb)" transform="translate(80) scale(.94)">
        <g strokeWidth="1pt">
          <path fill="#006" d="M-256 0H768v512H-256z"/>
          <path fill="#fff" d="M-256 0v57.244l909.2 454.756H768v-57.244L-141.2 0H-256zM768 0v57.244L-141.2 512H-256v-57.244L909.2 0H768z" strokeWidth=".8"/>
          <path fill="#fff" d="M170.6 0h512v170.6H170.6zm0 341.2h512V512H170.6z" strokeWidth=".8"/>
          <path fill="#c00" d="M-256 204.8H768v102.4H-256z" strokeWidth=".8"/>
          <path fill="#c00" d="M204.8 0h102.4v512H204.8z" strokeWidth=".8"/>
        </g>
      </g>
    </svg>
  )

  const languages = [
    { code: 'fr', name: 'Français', Flag: FlagFR },
    { code: 'en', name: 'English', Flag: FlagGB }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
    // Mettre à jour l'attribut lang du HTML
    document.documentElement.lang = langCode
  }

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-accent-orange transition-colors p-2 rounded-lg hover:bg-white/10"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="flex items-center justify-center">{React.createElement(currentLanguage.Flag)}</span>
        <span className="hidden md:inline text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent-orange/10 transition-colors ${
                  i18n.language === lang.code ? 'bg-accent-orange/20 font-semibold' : ''
                }`}
              >
                <span className="flex items-center justify-center">{React.createElement(lang.Flag)}</span>
                <span className={`flex-1 ${i18n.language === lang.code ? 'text-accent-orange' : 'text-gray-700'}`}>
                  {lang.name}
                </span>
                {i18n.language === lang.code && (
                  <svg className="w-5 h-5 text-accent-orange" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher


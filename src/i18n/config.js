import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import frTranslations from './locales/fr.json'
import enTranslations from './locales/en.json'

i18n
  // Détecter la langue du navigateur
  .use(LanguageDetector)
  // Passer l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialiser i18next
  .init({
    // Langues supportées
    supportedLngs: ['fr', 'en'],
    // Langue par défaut
    fallbackLng: 'fr',
    // Ressources de traduction
    resources: {
      fr: {
        translation: frTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    // Options de détection
    detection: {
      // Ordre de détection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache de la langue dans localStorage
      caches: ['localStorage'],
      // Clé dans localStorage
      lookupLocalStorage: 'i18nextLng'
    },
    // Options d'interpolation
    interpolation: {
      escapeValue: false // React échappe déjà les valeurs
    },
    // Options de réactivité
    react: {
      useSuspense: false
    }
  })

export default i18n


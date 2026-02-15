import { useTranslation as useI18nTranslation } from 'react-i18next'
import { useMemo } from 'react'

/**
 * Hook personnalisé pour traduire le contenu dynamique (articles, catégories)
 * Utilise l'API LibreTranslate (gratuite) pour traduire le contenu
 */
export const useContentTranslation = () => {
  const { i18n } = useI18nTranslation()
  const currentLang = i18n.language

  // Cache pour stocker les traductions déjà effectuées
  const translationCache = useMemo(() => new Map(), [])

  /**
   * Traduit un texte en utilisant l'API LibreTranslate
   * @param {string} text - Texte à traduire
   * @param {string} targetLang - Langue cible (fr/en)
   * @returns {Promise<string>} Texte traduit
   */
  const translateText = async (text, targetLang = currentLang) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return text
    }

    // Si la langue cible est la même que la langue source, pas besoin de traduire
    // On suppose que le contenu est en français par défaut
    if (targetLang === 'fr') {
      return text
    }

    // Vérifier le cache
    const cacheKey = `${text}_${targetLang}`
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)
    }

    try {
      // Utiliser l'API LibreTranslate (gratuite et open source)
      // Alternative: utiliser l'API Google Translate gratuite via un proxy
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'fr',
          target: targetLang === 'en' ? 'en' : 'fr',
          format: 'text'
        })
      })

      if (!response.ok) {
        console.warn('Erreur traduction LibreTranslate, utilisation du texte original')
        return text
      }

      const data = await response.json()
      const translatedText = data.translatedText || text

      // Mettre en cache
      translationCache.set(cacheKey, translatedText)

      return translatedText
    } catch (error) {
      console.warn('Erreur lors de la traduction:', error)
      // En cas d'erreur, retourner le texte original
      return text
    }
  }

  /**
   * Traduit un article (titre, description, contenu)
   * @param {Object} article - Article à traduire
   * @returns {Promise<Object>} Article traduit
   */
  const translateArticle = async (article) => {
    if (!article || currentLang === 'fr') {
      return article
    }

    try {
      const [translatedTitle, translatedExcerpt, translatedDescription] = await Promise.all([
        translateText(article.title || '', currentLang),
        translateText(article.excerpt || '', currentLang),
        translateText(article.description || '', currentLang)
      ])

      return {
        ...article,
        title: translatedTitle,
        excerpt: translatedExcerpt,
        description: translatedDescription
      }
    } catch (error) {
      console.warn('Erreur traduction article:', error)
      return article
    }
  }

  /**
   * Traduit une catégorie (nom)
   * @param {Object} category - Catégorie à traduire
   * @returns {Promise<Object>} Catégorie traduite
   */
  const translateCategory = async (category) => {
    if (!category || currentLang === 'fr') {
      return category
    }

    try {
      const translatedName = await translateText(
        category.name || category || '', 
        currentLang
      )

      return {
        ...category,
        name: translatedName
      }
    } catch (error) {
      console.warn('Erreur traduction catégorie:', error)
      return category
    }
  }

  return {
    translateText,
    translateArticle,
    translateCategory,
    currentLang
  }
}


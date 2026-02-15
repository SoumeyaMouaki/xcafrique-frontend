/**
 * Dictionnaire de traductions pour les catégories et termes courants
 * Plus rapide et plus fiable qu'une API de traduction externe
 */

export const categoryTranslations = {
  'Actualité': 'News',
  'actualité': 'news',
  'Actualités': 'News',
  'actualités': 'news',
  'Sécurité': 'Safety',
  'sécurité': 'safety',
  'Réglementation': 'Regulation',
  'réglementation': 'regulation',
  'Infrastructure': 'Infrastructure',
  'infrastructure': 'infrastructure',
  'Compagnies aériennes': 'Airlines',
  'compagnies aériennes': 'airlines',
  'Formation': 'Training',
  'formation': 'training',
  'Innovation': 'Innovation',
  'innovation': 'innovation',
  'Économie': 'Economy',
  'économie': 'economy',
  'Technologie': 'Technology',
  'technologie': 'technology',
  'Général': 'General',
  'général': 'general'
}

/**
 * Traduit une catégorie en fonction de la langue actuelle
 * @param {string|Object} category - Nom de la catégorie ou objet catégorie
 * @param {string} lang - Langue cible ('fr' ou 'en')
 * @returns {string|Object} Catégorie traduite
 */
export const translateCategory = (category, lang = 'fr') => {
  if (!category) return category

  // Si c'est un objet avec une propriété name
  if (typeof category === 'object' && category.name) {
    const translatedName = translateCategory(category.name, lang)
    return {
      ...category,
      name: translatedName
    }
  }

  // Si c'est une string
  if (typeof category === 'string') {
    if (lang === 'fr') {
      return category // Déjà en français
    }

    // Traduire vers l'anglais
    const translation = categoryTranslations[category]
    return translation || category // Retourner l'original si pas de traduction
  }

  return category
}

/**
 * Traduit un texte simple (pour les titres d'articles si nécessaire)
 * Note: Pour une traduction complète des articles, il faudrait utiliser une API
 * ou que le backend fournisse les traductions
 */
export const translateText = (text, lang = 'fr') => {
  if (!text || typeof text !== 'string') return text
  if (lang === 'fr') return text
  
  // Pour l'instant, on retourne le texte original
  // Une vraie traduction nécessiterait une API ou des traductions côté backend
  return text
}


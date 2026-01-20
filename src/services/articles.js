/**
 * Service pour gérer les articles depuis l'API backend
 * Suit la structure standardisée de l'API : { success, data, count, total, page, pages }
 */

import API from '../api'
import { extractApiData, extractApiItem, extractPagination, handleApiError } from '../utils/apiHelpers'

/**
 * Récupère la liste des articles publiés
 * @param {Object} params - Paramètres de requête
 * @param {number} params.page - Numéro de page (défaut: 1)
 * @param {number} params.limit - Nombre d'articles par page (défaut: 10)
 * @param {string} params.category - Slug de la catégorie
 * @param {string} params.search - Terme de recherche
 * @param {string} params.type - 'video' pour filtrer uniquement les vidéos
 * @returns {Promise<Object>} { articles, pagination, error }
 */
/**
 * Filtre les articles côté client par catégorie
 * Utilisé comme solution de contournement si le filtre backend retourne 404
 */
const filterArticlesByCategory = (articles, categorySlug) => {
  if (!categorySlug) return articles
  
  const normalizedCategorySlug = categorySlug.toLowerCase().trim()
  
  return articles.filter(article => {
    if (!article.category) return false
    
    const articleCategorySlug = (article.category.slug || '').toLowerCase().trim()
    const articleCategoryName = (article.category.name || '').toLowerCase().trim()
    
    return articleCategorySlug === normalizedCategorySlug || 
           articleCategoryName === normalizedCategorySlug ||
           articleCategorySlug.includes(normalizedCategorySlug) ||
           articleCategoryName.includes(normalizedCategorySlug)
  })
}

/**
 * Filtre les articles côté client par type (video)
 */
const filterArticlesByType = (articles, type) => {
  if (!type || type !== 'video') return articles
  
  return articles.filter(article => {
    // Un article vidéo a un videoUrl non vide
    return article.videoUrl && article.videoUrl.trim() !== ''
  })
}

export const fetchArticles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.category) queryParams.append('category', params.category)
    if (params.search) queryParams.append('search', params.search)
    if (params.type) queryParams.append('type', params.type)

    const queryString = queryParams.toString()
    const url = queryString ? `/articles?${queryString}` : '/articles'
    
    const response = await API.get(url)
    const articles = extractApiData(response)
    const pagination = extractPagination(response)

    return {
      success: true,
      articles,
      pagination,
      error: null
    }
  } catch (err) {
    const apiError = handleApiError(err)
    
    // Solution de contournement : Si erreur 404 avec filtre de catégorie,
    // récupérer tous les articles et filtrer côté client
    if (apiError.status === 404 && params.category) {
      console.warn('⚠️ Filtre de catégorie retourne 404, utilisation du fallback côté client')
      
      try {
        // Récupérer tous les articles sans filtre
        const fallbackResponse = await API.get('/articles?limit=1000')
        const allArticles = extractApiData(fallbackResponse)
        
        // Filtrer côté client par catégorie
        let filteredArticles = filterArticlesByCategory(allArticles, params.category)
        
        // Appliquer aussi le filtre type si présent
        if (params.type) {
          filteredArticles = filterArticlesByType(filteredArticles, params.type)
        }
        
        // Appliquer la pagination côté client si nécessaire
        if (params.page && params.limit) {
          const startIndex = (params.page - 1) * params.limit
          const endIndex = startIndex + params.limit
          filteredArticles = filteredArticles.slice(startIndex, endIndex)
        }
        
        return {
          success: true,
          articles: filteredArticles,
          pagination: {
            page: params.page || 1,
            pages: Math.ceil(filteredArticles.length / (params.limit || 10)),
            total: filteredArticles.length,
            count: filteredArticles.length
          },
          error: null,
          fallback: true // Indique que le fallback a été utilisé
        }
      } catch (fallbackError) {
        // Si même le fallback échoue, retourner un tableau vide
        console.error('Erreur lors du fallback:', fallbackError)
        return {
          success: true,
          articles: [],
          pagination: null,
          error: null
        }
      }
    }
    
    return {
      success: false,
      articles: [],
      pagination: null,
      error: apiError
    }
  }
}

/**
 * Récupère un article par son slug
 * @param {string} slug - Slug de l'article
 * @returns {Promise<Object>} { article, error }
 */
export const fetchArticleBySlug = async (slug) => {
  if (!slug) {
    return {
      success: false,
      article: null,
      error: { message: 'Slug requis' }
    }
  }

  try {
    // Encoder le slug pour l'URL (gérer les caractères spéciaux)
    const encodedSlug = encodeURIComponent(slug)
    console.log('fetchArticleBySlug: Slug original:', slug)
    console.log('fetchArticleBySlug: Slug encodé:', encodedSlug)
    
    const response = await API.get(`/articles/${encodedSlug}`)
    const article = extractApiItem(response)

    if (!article) {
      console.warn('fetchArticleBySlug: Article non trouvé pour le slug:', slug)
      return {
        success: false,
        article: null,
        error: { message: 'Article non trouvé' }
      }
    }

    console.log('fetchArticleBySlug: Article trouvé:', article.title)
    return {
      success: true,
      article,
      error: null
    }
  } catch (err) {
    const apiError = handleApiError(err)
    console.error('fetchArticleBySlug: Erreur API:', apiError)
    return {
      success: false,
      article: null,
      error: apiError
    }
  }
}


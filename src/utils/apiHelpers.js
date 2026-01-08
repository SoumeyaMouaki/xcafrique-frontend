/**
 * Utilitaires pour gérer les réponses de l'API
 * Gère la structure standardisée : { success, data, count, total, page, pages }
 */

/**
 * Extrait les données d'une réponse API
 * Structure attendue : { success: true, data: [...], count, total, page, pages }
 */
export const extractApiData = (response) => {
  if (!response || !response.data) {
    return []
  }

  const apiResponse = response.data

  // Vérifier que la réponse est un succès
  if (apiResponse.success === false) {
    return []
  }

  // Si response.data.data existe et est un tableau (structure standardisée)
  if (apiResponse.data && Array.isArray(apiResponse.data)) {
    return apiResponse.data
  }

  // Fallback pour compatibilité
  if (Array.isArray(apiResponse.data)) {
    return apiResponse.data
  }

  return []
}

/**
 * Extrait un objet unique d'une réponse API
 * Structure attendue : { success: true, data: {...} }
 */
export const extractApiItem = (response) => {
  if (!response || !response.data) {
    return null
  }

  const apiResponse = response.data

  // Vérifier que la réponse est un succès
  if (apiResponse.success === false) {
    return null
  }

  // Si response.data.data existe (structure standardisée)
  if (apiResponse.data && typeof apiResponse.data === 'object' && !Array.isArray(apiResponse.data)) {
    return apiResponse.data
  }

  // Fallback pour compatibilité
  if (typeof apiResponse.data === 'object' && !Array.isArray(apiResponse.data)) {
    return apiResponse.data
  }

  return null
}

/**
 * Extrait les métadonnées de pagination d'une réponse API
 */
export const extractPagination = (response) => {
  if (!response || !response.data) {
    return null
  }

  const apiResponse = response.data

  if (apiResponse.success && (apiResponse.page !== undefined || apiResponse.count !== undefined)) {
    return {
      page: apiResponse.page || 1,
      pages: apiResponse.pages || 1,
      total: apiResponse.total || 0,
      count: apiResponse.count || 0
    }
  }

  return null
}

/**
 * Gère les erreurs API de manière standardisée
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur avec réponse du serveur
    return {
      message: error.response.data?.message || 'Une erreur est survenue',
      status: error.response.status,
      data: error.response.data
    }
  } else if (error.request) {
    // Requête envoyée mais pas de réponse
    // Détecter les erreurs CORS
    const isCorsError = error.code === 'ERR_NETWORK' || 
                       error.message === 'Network Error' ||
                       (error.request && error.request.status === 0);
    
    if (isCorsError) {
      return {
        message: 'Erreur CORS: Le backend n\'autorise pas les requêtes depuis cette origine. Redémarrez le serveur de développement ou vérifiez la configuration CORS du backend.',
        status: 0,
        isCors: true
      }
    }
    
    return {
      message: 'Impossible de contacter le serveur. Vérifiez la configuration de l\'API.',
      status: 0
    }
  } else {
    // Erreur lors de la configuration de la requête
    return {
      message: error.message || 'Une erreur est survenue',
      status: 0
    }
  }
}


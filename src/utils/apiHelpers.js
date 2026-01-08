/**
 * Utilitaires pour gérer les réponses de l'API
 * Gère les différentes structures de réponse possibles
 */

/**
 * Extrait les données d'une réponse API
 * Gère les structures : { data: [...] }, { data: { data: [...] } }, ou directement [...]
 */
export const extractApiData = (response) => {
  if (!response || !response.data) {
    return []
  }

  // Si response.data est un tableau, le retourner directement
  if (Array.isArray(response.data)) {
    return response.data
  }

  // Si response.data.data existe et est un tableau
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data
  }

  // Si response.data.data existe mais n'est pas un tableau, essayer response.data
  if (response.data.data) {
    return [response.data.data]
  }

  // Si response.data est un objet unique, le retourner dans un tableau
  if (typeof response.data === 'object') {
    return [response.data]
  }

  return []
}

/**
 * Extrait un objet unique d'une réponse API
 */
export const extractApiItem = (response) => {
  if (!response || !response.data) {
    return null
  }

  // Si response.data est directement l'objet
  if (typeof response.data === 'object' && !Array.isArray(response.data)) {
    // Si c'est dans response.data.data
    if (response.data.data && typeof response.data.data === 'object') {
      return response.data.data
    }
    return response.data
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


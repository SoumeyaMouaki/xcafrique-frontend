/**
 * Hook personnalisé pour récupérer les articles depuis l'API
 * Supporte la pagination, les filtres par catégorie, la recherche et le filtrage par type
 * 
 * @param {Object} params - Paramètres de requête
 * @param {number} params.page - Numéro de page (défaut: 1)
 * @param {number} params.limit - Nombre d'articles par page (défaut: 10)
 * @param {string} params.category - Slug de la catégorie
 * @param {string} params.search - Terme de recherche
 * @param {string} params.type - 'video' pour filtrer uniquement les vidéos
 * @returns {Object} { articles, loading, error, pagination, refetch }
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchArticles } from '../services/articles'

const useArticles = (params = {}) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  // Mémoriser les paramètres pour éviter les re-renders inutiles
  const memoizedParams = useMemo(() => params, [
    params.page,
    params.limit,
    params.category,
    params.search,
    params.type
  ])

  const loadArticles = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await fetchArticles(memoizedParams)

    if (result.success) {
      setArticles(result.articles)
      setPagination(result.pagination)
    } else {
      setError(result.error)
      setArticles([])
      setPagination(null)
    }

    setLoading(false)
  }, [memoizedParams])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const refetch = useCallback(() => {
    loadArticles()
  }, [loadArticles])

  return {
    articles,
    loading,
    error,
    pagination,
    refetch
  }
}

export default useArticles


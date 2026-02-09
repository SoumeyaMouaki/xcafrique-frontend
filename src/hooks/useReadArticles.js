import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'xcafrique_read_articles'

/**
 * Hook personnalisé pour gérer les articles lus
 * Utilise localStorage pour persister les données entre les sessions
 */
const useReadArticles = () => {
  const [readArticles, setReadArticles] = useState(new Set())

  // Charger les articles lus depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const readArray = JSON.parse(stored)
        setReadArticles(new Set(readArray))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles lus:', error)
    }
  }, [])

  // Marquer un article comme lu
  const markAsRead = useCallback((articleSlug) => {
    if (!articleSlug) return

    setReadArticles((prev) => {
      const newSet = new Set(prev)
      newSet.add(articleSlug)
      
      // Sauvegarder dans localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des articles lus:', error)
      }
      
      return newSet
    })
  }, [])

  // Vérifier si un article a été lu
  const isRead = useCallback((articleSlug) => {
    if (!articleSlug) return false
    return readArticles.has(articleSlug)
  }, [readArticles])

  // Réinitialiser les articles lus (pour le débogage ou reset)
  const clearReadArticles = useCallback(() => {
    setReadArticles(new Set())
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erreur lors de la suppression des articles lus:', error)
    }
  }, [])

  return {
    markAsRead,
    isRead,
    clearReadArticles,
    readCount: readArticles.size
  }
}

export default useReadArticles


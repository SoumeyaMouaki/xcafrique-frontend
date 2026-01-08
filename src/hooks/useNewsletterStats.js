import { useState, useEffect } from 'react'
import API from '../api'

/**
 * Hook personnalisé pour récupérer les statistiques de la newsletter
 */
const useNewsletterStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    unconfirmed: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }))
        
        const response = await API.get('/newsletter/stats')
        
        // Gérer le format de réponse du backend : { data: { total, confirmed } }
        const statsData = response.data?.data || response.data || {}
        
        setStats({
          total: statsData.total || 0,
          confirmed: statsData.confirmed || 0,
          unconfirmed: (statsData.total || 0) - (statsData.confirmed || 0),
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Erreur récupération statistiques newsletter:', error)
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || 'Impossible de charger les statistiques'
        }))
      }
    }

    fetchStats()
    
    // Rafraîchir les stats toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const refetch = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await API.get('/newsletter/stats')
      
      const statsData = response.data?.data || response.data || {}
      
      setStats({
        total: statsData.total || 0,
        confirmed: statsData.confirmed || 0,
        unconfirmed: (statsData.total || 0) - (statsData.confirmed || 0),
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Erreur récupération statistiques newsletter:', error)
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Impossible de charger les statistiques'
      }))
    }
  }

  return { stats, refetch }
}

export default useNewsletterStats


import { useEffect, useRef, useState } from 'react'

/**
 * Hook personnalisé pour gérer la connexion WebSocket
 * Se connecte automatiquement et écoute les événements de nouveaux abonnés
 */
const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000 // 3 secondes

  const connect = () => {
    try {
      // Convertir l'URL HTTP en WebSocket
      const wsUrl = url.replace(/^http/, 'ws').replace(/^https/, 'wss')
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setReconnectAttempts(0)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Gérer l'événement "new_subscriber"
          if (data.event === 'new_subscriber' || data.type === 'new_subscriber') {
            const subscriberData = data.data || data
            
            // Afficher la notification
            if (window.addNotification) {
              window.addNotification({
                type: 'success',
                title: '🎉 Nouvel abonné à la newsletter',
                message: `${subscriberData.email || 'Un nouvel utilisateur'} vient de s'abonner à la newsletter XCAfrique`,
                timestamp: subscriberData.timestamp || subscriberData.subscribedAt || new Date().toISOString(),
                duration: 6000
              })
            }
          }
        } catch (error) {
          console.error('Erreur parsing message WebSocket:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error)
        setIsConnected(false)
      }

      ws.onclose = () => {
        setIsConnected(false)
        
        // Tentative de reconnexion
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = reconnectDelay * (reconnectAttempts + 1)
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1)
            connect()
          }, delay)
        }
      }
    } catch (error) {
      console.error('Erreur création WebSocket:', error)
      setIsConnected(false)
    }
  }

  useEffect(() => {
    if (url) {
      connect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [url])

  return { isConnected, reconnectAttempts }
}

export default useWebSocket


import { useEffect, useRef, useState } from 'react'

/**
 * Hook personnalisé pour gérer Server-Sent Events (SSE)
 * Alternative à WebSocket si le backend ne supporte pas WebSocket
 */
const useSSE = (url) => {
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef(null)

  useEffect(() => {
    if (!url) return

    try {
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
      }

      eventSource.addEventListener('new_subscriber', (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Afficher la notification
          if (window.addNotification) {
            window.addNotification({
              type: 'success',
              title: '🎉 Nouvel abonné à la newsletter',
              message: `${data.email || 'Un nouvel utilisateur'} vient de s'abonner à la newsletter XCAfrique`,
              timestamp: data.timestamp || data.subscribedAt || new Date().toISOString(),
              duration: 6000
            })
          }
        } catch (error) {
          console.error('Erreur parsing SSE:', error)
        }
      })

      eventSource.onerror = (error) => {
        console.error('❌ Erreur SSE:', error)
        setIsConnected(false)
        
        // SSE se reconnecte automatiquement
        if (eventSource.readyState === EventSource.CLOSED) {
          setIsConnected(false)
        }
      }
    } catch (error) {
      console.error('Erreur création SSE:', error)
      setIsConnected(false)
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [url])

  return { isConnected }
}

export default useSSE


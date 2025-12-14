/**
 * Service de gestion des notifications
 * Gère la connexion WebSocket/SSE et les notifications
 */

// Configuration - Utiliser la même logique que api.js
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || "http://localhost:5000"
  }
  // En développement, utiliser localhost:5000 directement (pas de proxy pour WebSocket)
  return "http://localhost:5000"
}

const API_BASE_URL = getApiBaseUrl()

// Essayer WebSocket d'abord, puis SSE en fallback
let connectionType = 'websocket' // 'websocket' | 'sse' | 'none'
let wsConnection = null
let sseConnection = null

/**
 * Initialise la connexion pour les notifications
 */
export const initNotificationConnection = () => {
  // Pour WebSocket, utiliser directement localhost:5000 (le proxy Vite ne fonctionne pas pour WS)
  const wsBaseUrl = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || "http://localhost:5000")
    : "http://localhost:5000"
  
  // URL WebSocket
  const wsUrl = `${wsBaseUrl.replace(/^http/, 'ws').replace(/^https/, 'wss')}/api/newsletter/stream`
  
  // Pour SSE, utiliser le proxy en développement ou l'URL directe en production
  const sseBaseUrl = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || "http://localhost:5000")
    : "http://localhost:5000"
  const sseUrl = `${sseBaseUrl}/api/newsletter/stream`

  // Essayer WebSocket d'abord
  try {
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('✅ WebSocket connecté pour les notifications')
      connectionType = 'websocket'
      wsConnection = ws
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // Si le message est directement un objet subscriber (format backend)
        if (data.email && (data.createdAt || data.timestamp)) {
          console.log('Nouvel abonné reçu (WebSocket):', data.email, data.createdAt)
          handleNotification({
            event: 'new_subscriber',
            data: data
          })
        } else {
          // Format avec wrapper event/data
          handleNotification(data)
        }
      } catch (error) {
        console.error('Erreur parsing WebSocket:', error)
      }
    }

    ws.onerror = (error) => {
      console.warn('WebSocket non disponible, tentative SSE...', error)
      // Essayer SSE en fallback
      initSSEConnection(sseUrl)
    }

    ws.onclose = () => {
      console.log('WebSocket fermé')
      wsConnection = null
      // Tentative de reconnexion après 3 secondes
      setTimeout(() => {
        if (connectionType === 'websocket') {
          initNotificationConnection()
        }
      }, 3000)
    }
  } catch (error) {
    console.warn('WebSocket non supporté, utilisation de SSE:', error)
    initSSEConnection(sseUrl)
  }
}

/**
 * Initialise la connexion SSE
 */
const initSSEConnection = (url) => {
  try {
    const eventSource = new EventSource(url)
    sseConnection = eventSource
    connectionType = 'sse'

    eventSource.onopen = () => {
      console.log('✅ SSE connecté pour les notifications')
    }

    eventSource.addEventListener('new_subscriber', (event) => {
      try {
        const subscriber = JSON.parse(event.data)
        console.log('Nouvel abonné reçu:', subscriber.email, subscriber.createdAt)
        
        // Gérer la notification avec le format direct du backend
        handleNotification({
          event: 'new_subscriber',
          data: subscriber
        })
      } catch (error) {
        console.error('Erreur parsing SSE:', error)
      }
    })

    eventSource.onerror = (error) => {
      console.error('Erreur SSE:', error)
      if (eventSource.readyState === EventSource.CLOSED) {
        connectionType = 'none'
        sseConnection = null
      }
    }
  } catch (error) {
    console.error('Erreur création SSE:', error)
    connectionType = 'none'
  }
}

/**
 * Gère les notifications reçues
 */
const handleNotification = (data) => {
  if (data.event === 'new_subscriber' || data.type === 'new_subscriber') {
    const subscriberData = data.data || data
    
    // Formater la date si elle existe
    let formattedDate = ''
    if (subscriberData.createdAt || subscriberData.timestamp || subscriberData.subscribedAt) {
      const date = new Date(subscriberData.createdAt || subscriberData.timestamp || subscriberData.subscribedAt)
      formattedDate = date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // Afficher la notification via la fonction globale
    if (window.addNotification) {
      window.addNotification({
        type: 'success',
        title: '🎉 Nouvel abonné à la newsletter',
        message: `${subscriberData.email || 'Un nouvel utilisateur'} vient de s'abonner à la newsletter XCAfrique${formattedDate ? ` • ${formattedDate}` : ''}`,
        timestamp: subscriberData.createdAt || subscriberData.timestamp || subscriberData.subscribedAt || new Date().toISOString(),
        duration: 6000
      })
    }
  }
}

/**
 * Ferme la connexion
 */
export const closeNotificationConnection = () => {
  if (wsConnection) {
    wsConnection.close()
    wsConnection = null
  }
  if (sseConnection) {
    sseConnection.close()
    sseConnection = null
  }
  connectionType = 'none'
}

export default {
  initNotificationConnection,
  closeNotificationConnection,
  getConnectionType: () => connectionType
}


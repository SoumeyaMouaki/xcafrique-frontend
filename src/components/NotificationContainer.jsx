import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import NotificationToast from './NotificationToast'

/**
 * NotificationContainer - Gestionnaire de notifications
 * Gère l'affichage de plusieurs notifications en même temps
 */
const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([])

  // Fonction pour ajouter une notification (exposée via window pour être accessible globalement)
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp || new Date().toISOString(),
      duration: notification.duration || 5000,
      autoClose: notification.autoClose !== false,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  // Fonction pour retirer une notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [])

  // Exposer la fonction globalement pour qu'elle soit accessible depuis les WebSockets
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addNotification = addNotification
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.addNotification
      }
    }
  }, [addNotification])

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {notifications.map(notification => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NotificationContainer


# 🔔 Système de Notifications en Temps Réel

## 📋 Vue d'ensemble

Un système de notifications en temps réel a été ajouté au frontend pour afficher des alertes lorsqu'un nouvel utilisateur s'abonne à la newsletter.

## 🎯 Fonctionnalités

- ✅ Notifications toast élégantes dans le coin supérieur droit
- ✅ Support WebSocket et SSE (Server-Sent Events) avec fallback automatique
- ✅ Reconnexion automatique en cas de perte de connexion
- ✅ Animations fluides avec Framer Motion
- ✅ Auto-dismiss après 6 secondes (configurable)
- ✅ Design moderne avec Tailwind CSS
- ✅ Responsive et accessible

## 📁 Structure des fichiers

```
src/
├── components/
│   ├── NotificationToast.jsx      # Composant de notification individuelle
│   └── NotificationContainer.jsx  # Gestionnaire de notifications
├── hooks/
│   ├── useWebSocket.js            # Hook WebSocket (optionnel)
│   └── useSSE.js                  # Hook SSE (optionnel)
├── services/
│   └── notificationService.js     # Service principal de notifications
└── App.jsx                        # Intégration dans l'application
```

## 🔌 Configuration Backend Requise

Le frontend attend que le backend expose un endpoint pour les notifications en temps réel.

### Option 1 : WebSocket (Recommandé)

**Endpoint** : `ws://localhost:5000/api/newsletter/stream` (ou `wss://` en production)

**Format des messages** :
```json
{
  "event": "new_subscriber",
  "data": {
    "email": "user@example.com",
    "timestamp": "2024-01-15T10:30:00Z",
    "subscribedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Option 2 : Server-Sent Events (SSE)

**Endpoint** : `http://localhost:5000/api/newsletter/stream`

**Format des événements** :
```
event: new_subscriber
data: {"email":"user@example.com","timestamp":"2024-01-15T10:30:00Z"}
```

## 🎨 Personnalisation

### Modifier la durée d'affichage

Dans `NotificationContainer.jsx`, modifiez la propriété `duration` :

```javascript
window.addNotification({
  duration: 8000 // 8 secondes au lieu de 5
})
```

### Changer la position

Dans `NotificationContainer.jsx`, modifiez les classes Tailwind :

```javascript
// Coin supérieur gauche
<div className="fixed top-4 left-4 z-50 pointer-events-none">

// Coin inférieur droit
<div className="fixed bottom-4 right-4 z-50 pointer-events-none">
```

### Types de notifications

Les types disponibles sont :
- `success` (vert) - Par défaut pour les nouveaux abonnés
- `info` (bleu)
- `warning` (jaune)
- `error` (rouge)

## 🧪 Test manuel

Pour tester sans backend, vous pouvez ajouter une notification manuellement dans la console du navigateur :

```javascript
window.addNotification({
  type: 'success',
  title: '🎉 Nouvel abonné à la newsletter',
  message: 'test@example.com vient de s\'abonner à la newsletter XCAfrique',
  timestamp: new Date().toISOString()
})
```

## 🔧 Dépannage

### Les notifications ne s'affichent pas

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que le backend expose bien l'endpoint `/api/newsletter/stream`
3. Vérifiez que CORS est configuré pour autoriser les connexions WebSocket/SSE
4. Vérifiez que le backend émet bien l'événement `new_subscriber`

### La connexion WebSocket échoue

Le système basculera automatiquement sur SSE. Vérifiez que votre backend supporte au moins l'une des deux technologies.

### Messages dans la console

- `✅ WebSocket connecté` : Connexion réussie
- `✅ SSE connecté` : Connexion SSE réussie (fallback)
- `❌ Erreur WebSocket` : Erreur de connexion (le système essaiera SSE)

## 📝 Notes

- Le système tente d'abord WebSocket, puis SSE en fallback
- La reconnexion automatique est limitée à 5 tentatives
- Les notifications sont stockées en mémoire (pas de persistance)
- Le système ne nécessite aucune configuration supplémentaire côté frontend


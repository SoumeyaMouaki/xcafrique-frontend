# Guide d'intégration avec l'API Backend

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_API_URL=http://localhost:5000/api
```

Pour la production, remplacez par l'URL de votre API de production.

### Structure des réponses API

Le frontend est conçu pour gérer différentes structures de réponses API :

1. **Structure avec wrapper `data`** :
```json
{
  "data": [...]
}
```

2. **Structure avec double wrapper** :
```json
{
  "data": {
    "data": [...]
  }
}
```

3. **Structure directe** :
```json
[...]
```

Les utilitaires dans `src/utils/apiHelpers.js` gèrent automatiquement ces variations.

## Endpoints utilisés

### Articles

- `GET /api/articles` - Liste tous les articles
  - Query params : `status=published`, `featured=true`, `category=<id>`, `limit=<n>`, `page=<n>`
  
- `GET /api/articles/:id` - Récupère un article par ID

### Catégories

- `GET /api/categories` - Liste toutes les catégories

### Contact

- `POST /api/contact` - Envoie un message de contact
  - Body : `{ name, email, subject, message }`

## Gestion des erreurs

Le frontend gère automatiquement :
- Erreurs réseau (pas de connexion au serveur)
- Erreurs HTTP (404, 500, etc.)
- Timeout de requête (10 secondes)

Les erreurs sont affichées via le composant `ErrorMessage` avec possibilité de réessayer.

## Authentification

Si vous utilisez l'authentification admin, le token JWT est automatiquement injecté dans les headers via l'intercepteur axios.

Le token doit être stocké dans `localStorage` avec la clé `"token"`.

## Test de l'intégration

1. Assurez-vous que le backend est démarré sur `http://localhost:5000`
2. Vérifiez que MongoDB est connecté
3. Créez quelques articles et catégories via l'API admin
4. Testez l'affichage sur le frontend

## Dépannage

### Les articles ne s'affichent pas

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que l'API retourne bien des données avec `status=published`
3. Vérifiez l'URL de l'API dans `.env`

### Erreur CORS

Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173` (ou votre URL frontend).

### Timeout

Si les requêtes timeout, vérifiez :
- Que le backend est bien démarré
- Que l'URL dans `.env` est correcte
- Que le backend répond rapidement


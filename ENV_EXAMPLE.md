# Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration API Backend
# En développement, le proxy Vite est utilisé (voir vite.config.js)
# En production, définissez l'URL complète de votre API

# URL de base de l'API (sans /api à la fin)
# Exemple production: https://api.xcafrique.com
# Exemple développement: http://localhost:5000
VITE_API_URL=http://localhost:5000
```

## Configuration Vercel

Pour déployer sur Vercel :

1. Allez dans **Settings > Environment Variables**
2. Ajoutez la variable `VITE_API_URL` avec l'URL de votre API de production
3. Redéployez votre application

**Note** : Les variables d'environnement doivent commencer par `VITE_` pour être accessibles dans le code frontend avec Vite.


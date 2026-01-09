# Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration API Backend
# En développement, le proxy Vite est utilisé (voir vite.config.js)
# En production, définissez l'URL complète de votre API

# URL de base de l'API (sans /api à la fin)
# Développement local
VITE_API_URL=http://localhost:5000

# Production (backend déployé sur Vercel)
# VITE_API_URL=https://xcafrique-backend.vercel.app

# URL du site (pour les liens et partage social)
VITE_SITE_URL=https://xcafrique.org
```

## Configuration Vercel

Pour déployer sur Vercel :

1. Allez dans **Settings > Environment Variables**
2. Ajoutez les variables suivantes :
   - `VITE_API_URL` = `https://xcafrique-backend.vercel.app` (sans /api à la fin)
   - `VITE_SITE_URL` = `https://xcafrique.org`
3. Redéployez votre application

**Note** : Les variables d'environnement doivent commencer par `VITE_` pour être accessibles dans le code frontend avec Vite.

### Variables pour la production

```env
VITE_API_URL=https://xcafrique-backend.vercel.app
VITE_SITE_URL=https://xcafrique.org
```


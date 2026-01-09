# 🚀 Configuration Vercel pour XCAfrique Frontend

## Variables d'environnement à configurer sur Vercel

Pour que votre frontend fonctionne correctement avec le backend déployé, configurez ces variables dans Vercel :

### 1. Aller dans les paramètres du projet

1. Ouvrez votre projet sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet **XCAfrique-Frontend**
3. Allez dans **Settings** > **Environment Variables**

### 2. Ajouter les variables d'environnement

Ajoutez ces deux variables :

#### Variable 1 : `VITE_API_URL`
- **Valeur** : `https://xcafrique-backend.vercel.app`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Note** : **SANS `/api` à la fin** - Le code ajoute automatiquement `/api`. Si vous mettez `/api`, le code le nettoie automatiquement pour éviter le double `/api/api/`

#### Variable 2 : `VITE_SITE_URL`
- **Valeur** : `https://xcafrique.org`
- **Environnements** : ✅ Production, ✅ Preview, ✅ Development
- **Note** : Utilisé pour les liens de partage social

### 3. Redéployer

Après avoir ajouté les variables :
1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Vérifiez que les variables sont bien sélectionnées

---

## 📋 Résumé de la configuration

### Développement local (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SITE_URL=https://xcafrique.org
```

### Production (Vercel Environment Variables)

```
VITE_API_URL=https://xcafrique-backend.vercel.app
VITE_SITE_URL=https://xcafrique.org
```

---

## ✅ Vérification

Après le déploiement, vérifiez que :

1. **Les requêtes API fonctionnent** :
   - Ouvrez la console du navigateur (F12)
   - Allez dans l'onglet **Network**
   - Les requêtes vers `/api/*` doivent pointer vers `https://xcafrique-backend.vercel.app/api/*`

2. **Les partages sociaux utilisent la bonne URL** :
   - Cliquez sur un bouton de partage (Twitter, Facebook, LinkedIn)
   - L'URL partagée doit être `https://xcafrique.org/article/...`

3. **Pas d'erreurs CORS** :
   - Vérifiez que le backend autorise les requêtes depuis `https://xcafrique.org`
   - Le backend doit avoir CORS configuré pour accepter votre domaine

---

## 🔧 Dépannage

### Les requêtes API ne fonctionnent pas

**Vérifiez** :
- Les variables d'environnement sont bien configurées sur Vercel
- Le backend est bien déployé et accessible sur `https://xcafrique-backend.vercel.app`
- Le backend a CORS configuré pour accepter les requêtes depuis votre domaine frontend

### Les partages utilisent localhost

**Cause** : `VITE_SITE_URL` n'est pas configuré ou mal configuré

**Solution** : Vérifiez que `VITE_SITE_URL=https://xcafrique.org` est bien configuré sur Vercel

### Erreurs 404 sur certains endpoints

**Cause** : Les endpoints n'existent pas dans le backend

**Solution** : Vérifiez la documentation de votre backend pour voir quels endpoints sont disponibles

---

## 📝 Notes importantes

1. **Les variables doivent commencer par `VITE_`** pour être accessibles dans le code frontend
2. **Redéployez après chaque modification** des variables d'environnement
3. **Le proxy Vite n'est utilisé qu'en développement local**, en production les requêtes vont directement vers le backend
4. **Vérifiez la configuration CORS du backend** pour accepter les requêtes depuis votre domaine de production


# 🔧 Guide de dépannage - Frontend XCAfrique

## ❌ Erreur : ERR_CONNECTION_REFUSED

### Symptômes

```
❌ Erreur abonnement newsletter: Object
⚠️ Erreur réseau. Vérifiez que le backend est accessible et que CORS est configuré correctement.
api/newsletter/subscribe:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

### Cause

Le backend n'est **pas démarré** ou n'est **pas accessible** sur le port 5000.

### Solution

1. **Démarrez le backend local** :
   ```bash
   # Dans le dossier backend
   cd ../xcafrique-backend  # ou le chemin vers votre backend
   npm run dev
   # Le backend doit démarrer sur http://localhost:5000
   ```

2. **Vérifiez que le backend est accessible** :
   - Ouvrez votre navigateur
   - Allez sur : `http://localhost:5000/api/articles`
   - Vous devriez voir une réponse JSON (même vide)

3. **Vérifiez le port** :
   - Le backend doit être sur le port **5000**
   - Si vous utilisez un autre port, modifiez `vite.config.js` :
     ```javascript
     proxy: {
       '/api': {
         target: 'http://localhost:VOTRE_PORT',  // Remplacez VOTRE_PORT
         changeOrigin: true,
         secure: false,
       }
     }
     ```

4. **Redémarrez le serveur frontend** :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   # Puis relancez
   npm run dev
   ```

---

## ❌ Erreur : ERR_NETWORK ou Network Error

### Symptômes

```
❌ Erreur abonnement newsletter: Network Error
```

### Causes possibles

1. **Backend non démarré** (voir solution ci-dessus)
2. **Problème CORS** : Le backend bloque les requêtes depuis le frontend
3. **URL incorrecte** : L'URL de l'API est incorrecte

### Solutions

1. **Vérifiez que le backend est démarré** (voir section précédente)

2. **Vérifiez la configuration CORS du backend** :
   - Le backend doit autoriser les requêtes depuis `http://localhost:5173`
   - Vérifiez la configuration CORS dans le backend

3. **Vérifiez l'URL de l'API** :
   - Ouvrez la console du navigateur (F12)
   - Allez dans l'onglet **Network**
   - Vérifiez que les requêtes vont vers `http://localhost:5173/api/...`
   - Le proxy Vite devrait rediriger vers `http://localhost:5000/api/...`

---

## ❌ Erreur : Double /api/api/ dans l'URL

### Symptômes

```
POST https://xcafrique-backend.vercel.app/api/api/newsletter/subscribe
```

### Cause

La variable d'environnement `VITE_API_URL` contient déjà `/api` à la fin.

### Solution

1. **Vérifiez le fichier `.env`** :
   ```env
   # ✅ Correct
   VITE_API_URL=http://localhost:5000
   
   # ❌ Incorrect
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Vérifiez les variables Vercel** :
   - Allez dans **Settings > Environment Variables**
   - `VITE_API_URL` doit être : `https://xcafrique-backend.vercel.app` (SANS `/api`)

3. **Redéployez** après correction

---

## ❌ Erreur : Port 5175 au lieu de 5173

### Symptômes

```
Failed to load resource: net::ERR_CONNECTION_REFUSED
GET http://localhost:5175/ net::ERR_CONNECTION_REFUSED
```

### Cause

Quelque chose essaie de se connecter au port 5175 au lieu de 5173 (port par défaut de Vite).

### Solution

1. **Vérifiez que le serveur frontend est bien démarré** :
   ```bash
   npm run dev
   # Le serveur doit démarrer sur http://localhost:5173
   ```

2. **Vérifiez les autres processus** :
   - Fermez tous les autres serveurs de développement
   - Redémarrez le serveur frontend

3. **Vérifiez la configuration Vite** :
   - Le port par défaut est 5173
   - Si vous avez modifié le port, vérifiez `vite.config.js`

---

## ✅ Checklist de vérification

Avant de signaler un problème, vérifiez :

- [ ] Le backend est démarré sur `http://localhost:5000`
- [ ] Le frontend est démarré sur `http://localhost:5173`
- [ ] Le fichier `.env` existe et contient `VITE_API_URL=http://localhost:5000`
- [ ] Aucune erreur dans la console du backend
- [ ] Aucune erreur dans la console du frontend
- [ ] Les requêtes API vont vers `http://localhost:5173/api/...` (proxy Vite)
- [ ] Le backend répond à `http://localhost:5000/api/articles` dans le navigateur

---

## 🔍 Comment déboguer

### 1. Vérifier que le backend répond

Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/api/articles
```

**Résultat attendu** :
- ✅ Réponse JSON (même vide) = Backend OK
- ❌ Erreur de connexion = Backend non démarré

### 2. Vérifier les requêtes dans le navigateur

1. Ouvrez la console (F12)
2. Allez dans l'onglet **Network**
3. Effectuez une action qui appelle l'API (ex: abonnement newsletter)
4. Vérifiez :
   - **URL de la requête** : Doit être `http://localhost:5173/api/...`
   - **Status** : Doit être `200` (succès) ou `404` (endpoint inexistant)
   - **Response** : Doit contenir du JSON

### 3. Vérifier les logs

**Backend** :
- Vérifiez les logs du serveur backend
- Vous devriez voir les requêtes entrantes

**Frontend** :
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs et les logs

---

## 📞 Besoin d'aide supplémentaire ?

Si le problème persiste :

1. **Partagez les logs** :
   - Logs du backend
   - Console du navigateur (erreurs)
   - Onglet Network (requêtes)

2. **Vérifiez la configuration** :
   - Fichier `.env`
   - `vite.config.js`
   - Variables d'environnement Vercel (si en production)

3. **Testez avec curl** :
   ```bash
   # Test du backend
   curl http://localhost:5000/api/articles
   ```

---

## 🚀 Commandes utiles

```bash
# Démarrer le backend
cd ../xcafrique-backend
npm run dev

# Démarrer le frontend (dans un autre terminal)
cd ../xcafrique-frontend
npm run dev

# Vérifier les processus sur les ports
# Windows PowerShell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```


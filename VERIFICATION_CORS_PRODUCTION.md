# 🔍 Vérification CORS en Production

## ⚠️ Problème CORS en Production

Si vous avez des erreurs CORS en production, suivez ces étapes :

## ✅ Étape 1 : Vérifier les Variables d'Environnement sur Vercel

1. **Allez sur https://vercel.com**
2. **Ouvrez votre projet frontend**
3. **Allez dans Settings > Environment Variables**
4. **Vérifiez que ces variables existent** :
   - `VITE_API_URL` = `https://xcafrique-backend.vercel.app` (SANS `/api` à la fin)
   - `VITE_SITE_URL` = `https://xcafrique.org` (ou votre domaine)

5. **Si les variables n'existent pas ou sont incorrectes** :
   - Cliquez sur "Add New"
   - Ajoutez `VITE_API_URL` avec la valeur `https://xcafrique-backend.vercel.app`
   - Ajoutez `VITE_SITE_URL` avec la valeur `https://xcafrique.org`
   - **Important** : Sélectionnez "Production" dans les environnements

6. **Redéployez** :
   - Allez dans "Deployments"
   - Cliquez sur les trois points (⋯) du dernier déploiement
   - Sélectionnez "Redeploy"
   - **Décochez** "Use existing Build Cache"
   - Cliquez sur "Redeploy"

## ✅ Étape 2 : Vérifier la Configuration CORS du Backend

Le backend doit autoriser les requêtes depuis votre domaine frontend.

1. **Vérifiez les variables d'environnement du backend sur Vercel** :
   - Allez sur le projet backend sur Vercel
   - Settings > Environment Variables
   - Vérifiez que `ALLOWED_ORIGINS` contient votre domaine frontend :
     ```
     ALLOWED_ORIGINS=https://xcafrique.org,https://*.vercel.app,http://localhost:5173
     ```

2. **Si le backend n'autorise pas votre domaine** :
   - Ajoutez votre domaine à `ALLOWED_ORIGINS`
   - Redéployez le backend

## ✅ Étape 3 : Vérifier dans la Console du Navigateur

1. **Ouvrez votre site en production**
2. **Ouvrez la console du navigateur** (F12)
3. **Regardez le log** : `🔧 Configuration API:`
   - `apiBaseUrl` devrait être : `https://xcafrique-backend.vercel.app/api`
   - `viteApiUrl` devrait être : `https://xcafrique-backend.vercel.app`

4. **Si `viteApiUrl` est `undefined`** :
   - Les variables d'environnement ne sont pas configurées sur Vercel
   - Suivez l'Étape 1

5. **Onglet Network** :
   - Rechargez la page
   - Trouvez une requête vers `/api/...`
   - Vérifiez l'URL complète dans "Request URL"
   - Elle devrait être : `https://xcafrique-backend.vercel.app/api/...`

## ✅ Étape 4 : Vérifier les Headers CORS dans la Réponse

1. **Dans l'onglet Network** (F12)
2. **Cliquez sur une requête vers `/api/...`**
3. **Onglet "Headers"**
4. **Vérifiez les "Response Headers"** :
   - `Access-Control-Allow-Origin` devrait contenir votre domaine frontend
   - `Access-Control-Allow-Methods` devrait contenir `GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers` devrait contenir `Content-Type, Authorization`

5. **Si ces headers sont absents ou incorrects** :
   - Le problème vient du backend
   - Vérifiez la configuration CORS du backend

## 🔧 Solution Rapide

### Si les variables d'environnement ne sont pas configurées :

1. **Sur Vercel** → Votre projet → Settings → Environment Variables
2. **Ajoutez** :
   ```
   VITE_API_URL=https://xcafrique-backend.vercel.app
   VITE_SITE_URL=https://xcafrique.org
   ```
3. **Sélectionnez** "Production" (et "Preview" si vous voulez)
4. **Redéployez** avec cache vidé

### Si le backend n'autorise pas votre domaine :

1. **Sur Vercel** → Projet backend → Settings → Environment Variables
2. **Modifiez** `ALLOWED_ORIGINS` pour inclure :
   ```
   https://xcafrique.org,https://*.vercel.app,http://localhost:5173
   ```
3. **Redéployez** le backend

## 📝 Checklist

- [ ] Variables `VITE_API_URL` et `VITE_SITE_URL` configurées sur Vercel (frontend)
- [ ] Variable `ALLOWED_ORIGINS` contient votre domaine frontend (backend)
- [ ] Frontend redéployé après modification des variables
- [ ] Backend redéployé après modification de CORS
- [ ] Console du navigateur montre la bonne URL API
- [ ] Headers CORS présents dans les réponses du backend

## 🆘 Si le problème persiste

1. **Vérifiez les logs Vercel** :
   - Allez dans "Deployments" → Cliquez sur un déploiement
   - Vérifiez les "Build Logs" pour des erreurs

2. **Vérifiez les logs du backend** :
   - Allez sur le projet backend Vercel
   - Vérifiez les "Function Logs" pour des erreurs CORS

3. **Testez directement l'API** :
   ```bash
   curl -H "Origin: https://xcafrique.org" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://xcafrique-backend.vercel.app/api/articles
   ```
   - Vérifiez que les headers CORS sont présents dans la réponse


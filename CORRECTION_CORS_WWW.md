# 🔧 Correction CORS : Problème avec www.xcafrique.org

## ✅ Configuration Frontend Correcte

D'après les logs de la console, la configuration frontend est **correcte** :
- ✅ `apiBaseUrl`: `https://xcafrique-backend.vercel.app/api`
- ✅ `viteApiUrl`: `https://xcafrique-backend.vercel.app`
- ✅ `hostname`: `www.xcafrique.org`

## ✅ Configuration Backend (Vérifiée)

Votre configuration `ALLOWED_ORIGINS` est correcte :
- **Production** : `https://xcafrique.org,https://www.xcafrique.org` ✅
- **Développement** : `http://localhost:5173,http://localhost:3000` ✅
- **Preview** : `https://xcafrique-frontend.vercel.app,https://*.vercel.app` ✅

Si le problème CORS persiste malgré cette configuration, vérifiez les points suivants :

## ⚠️ Problèmes Possibles

Même si `ALLOWED_ORIGINS` est correctement configuré, le problème peut venir de :

1. **Backend non redéployé** après modification de `ALLOWED_ORIGINS`
2. **Parsing incorrect** de `ALLOWED_ORIGINS` dans le code backend
3. **Headers CORS manquants** dans certaines routes
4. **Wildcard `*.vercel.app`** qui ne fonctionne pas comme prévu

## 🔧 Solutions Possibles

### Solution 1 : Vérifier que le Backend a été Redéployé

Même si `ALLOWED_ORIGINS` est correct, le backend doit être **redéployé** après modification :

1. **Allez sur https://vercel.com**
2. **Ouvrez votre projet BACKEND** (xcafrique-backend)
3. **Allez dans "Deployments"**
4. **Vérifiez la date du dernier déploiement**
5. **Si c'était avant la modification de `ALLOWED_ORIGINS`**, redéployez :
   - Cliquez sur les trois points (⋯) du dernier déploiement
   - Sélectionnez "Redeploy"
   - **Décochez "Use existing Build Cache"**
   - Cliquez sur "Redeploy"

### Solution 2 : Vérifier le Code Backend

Le problème peut venir du code backend qui parse `ALLOWED_ORIGINS`. Vérifiez que :

1. **Le backend split correctement** `ALLOWED_ORIGINS` par les virgules
2. **Le backend compare exactement** l'origine de la requête avec les origines autorisées
3. **Le backend envoie bien** le header `Access-Control-Allow-Origin` dans toutes les réponses

### Solution 3 : Vérifier les Headers CORS

Testez avec le script ou curl pour voir ce que le backend retourne réellement.

1. **Allez dans "Deployments"**
2. **Cliquez sur les trois points (⋯)** du dernier déploiement
3. **Sélectionnez "Redeploy"**
4. **Décochez "Use existing Build Cache"**
5. **Cliquez sur "Redeploy"**

### Étape 4 : Vérifier

1. **Attendez la fin du déploiement** (2-5 minutes)
2. **Rechargez votre site frontend**
3. **Vérifiez que les erreurs CORS ont disparu**

## 🔍 Vérification Alternative : Redirection www → non-www

Si vous préférez, vous pouvez configurer Vercel pour rediriger automatiquement `www.xcafrique.org` vers `xcafrique.org`.

### Option A : Redirection dans vercel.json (Frontend)

Ajoutez dans `vercel.json` :

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "www.xcafrique.org"
        }
      ],
      "destination": "https://xcafrique.org/$1",
      "permanent": true
    }
  ]
}
```

### Option B : Configuration DNS

Configurez votre DNS pour que `www.xcafrique.org` redirige vers `xcafrique.org` au niveau DNS.

## 📝 Format Exact de ALLOWED_ORIGINS

Pour le backend, utilisez ce format exact (sans espaces) :

```
https://xcafrique.org,https://www.xcafrique.org,https://*.vercel.app,http://localhost:5173
```

**Important** :
- Pas d'espaces après les virgules
- Utilisez `https://` (pas `http://` pour la production)
- Incluez les deux variantes : avec et sans www

## 🧪 Test Rapide

### Option 1 : Script Node.js

Utilisez le script de test inclus :

```bash
node scripts/testCors.js
```

Ce script teste les trois origines et affiche les headers CORS retournés.

### Option 2 : curl

Pour tester manuellement :

```bash
curl -H "Origin: https://www.xcafrique.org" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://xcafrique-backend.vercel.app/api/articles \
     -v
```

Vérifiez dans la réponse que vous voyez :
```
Access-Control-Allow-Origin: https://www.xcafrique.org
```

Si vous voyez `Access-Control-Allow-Origin: *` ou une autre origine, le backend n'est pas configuré correctement.

### Option 3 : Dans le navigateur

1. Ouvrez votre site en production (`https://www.xcafrique.org`)
2. Ouvrez la console (F12)
3. Onglet **Network**
4. Rechargez la page
5. Cliquez sur une requête vers `/api/...`
6. Onglet **Headers** → **Response Headers**
7. Vérifiez `Access-Control-Allow-Origin`

Si c'est `null` ou une autre valeur que `https://www.xcafrique.org`, le problème vient du backend.

## ✅ Checklist

- [ ] Variable `ALLOWED_ORIGINS` contient `https://www.xcafrique.org`
- [ ] Variable `ALLOWED_ORIGINS` contient `https://xcafrique.org`
- [ ] Backend redéployé après modification
- [ ] Test curl montre les bons headers CORS
- [ ] Erreurs CORS disparues dans la console du navigateur


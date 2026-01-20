# 🔧 Correction CORS : Problème avec www.xcafrique.org

## ✅ Configuration Frontend Correcte

D'après les logs de la console, la configuration frontend est **correcte** :
- ✅ `apiBaseUrl`: `https://xcafrique-backend.vercel.app/api`
- ✅ `viteApiUrl`: `https://xcafrique-backend.vercel.app`
- ✅ `hostname`: `www.xcafrique.org`

## ⚠️ Problème Identifié

Le problème CORS vient probablement du **backend** qui n'autorise pas les requêtes depuis `www.xcafrique.org`.

Le backend autorise peut-être seulement `https://xcafrique.org` (sans www) mais pas `https://www.xcafrique.org` (avec www).

## 🔧 Solution : Configurer le Backend

### Étape 1 : Vérifier les Variables d'Environnement du Backend

1. **Allez sur https://vercel.com**
2. **Ouvrez votre projet BACKEND** (xcafrique-backend)
3. **Settings → Environment Variables**
4. **Trouvez la variable `ALLOWED_ORIGINS`**

### Étape 2 : Ajouter www.xcafrique.org

La variable `ALLOWED_ORIGINS` doit contenir **les deux domaines** :

```
https://xcafrique.org,https://www.xcafrique.org,https://*.vercel.app,http://localhost:5173
```

**OU** si vous utilisez un wildcard (si votre backend le supporte) :

```
https://*.xcafrique.org,https://*.vercel.app,http://localhost:5173
```

### Étape 3 : Redéployer le Backend

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

Pour tester si le backend autorise votre domaine :

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

## ✅ Checklist

- [ ] Variable `ALLOWED_ORIGINS` contient `https://www.xcafrique.org`
- [ ] Variable `ALLOWED_ORIGINS` contient `https://xcafrique.org`
- [ ] Backend redéployé après modification
- [ ] Test curl montre les bons headers CORS
- [ ] Erreurs CORS disparues dans la console du navigateur


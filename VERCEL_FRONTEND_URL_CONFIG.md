# 🔧 Configuration FRONTEND_URL_PROD pour Vercel

## Problème

En production, les emails de confirmation contiennent des URLs avec `localhost` qui ne sont pas accessibles depuis le site hébergé.

## ✅ Solution

Ajoutez la variable d'environnement `FRONTEND_URL_PROD` sur Vercel pour spécifier l'URL de production du frontend.

## Configuration sur Vercel

### 1. Allez dans Vercel Dashboard

1. Ouvrez votre projet **backend** sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Allez dans **Settings** → **Environment Variables**

### 2. Ajoutez la variable

**Variable :** `FRONTEND_URL_PROD`  
**Valeur :** `https://xcafrique.org`  
**Environnements :** 
- ✅ **Production** (obligatoire)
- ✅ **Preview** (optionnel, peut utiliser l'URL de preview)
- ❌ **Development** (pas nécessaire, utilise FRONTEND_URL)

### 3. Redéployez

Après avoir ajouté la variable, **redéployez** votre application backend :
1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Vérifiez que la variable `FRONTEND_URL_PROD` est bien sélectionnée

## Comportement

### En Production

Le backend utilise cette logique pour déterminer l'URL du frontend :

1. ✅ Utilise `FRONTEND_URL_PROD` si défini
2. ✅ Sinon, filtre `FRONTEND_URL` pour exclure localhost
3. ✅ Sinon, utilise `https://xcafrique.org` par défaut

### En Développement

- ✅ Utilise `FRONTEND_URL` (localhost)
- ✅ Exemple : `http://localhost:5173`

## Exemple de configuration

### Variables d'environnement Vercel (Backend)

```
# Production - URL du frontend en production
FRONTEND_URL_PROD=https://xcafrique.org

# Développement - URLs autorisées pour CORS (peut contenir plusieurs URLs séparées par des virgules)
FRONTEND_URL=http://localhost:5173,http://localhost:3000
```

### Résultat

#### Emails en production

Les emails de confirmation contiendront :
```
https://xcafrique.org/confirm-email?token=abc123...
```

#### Emails en développement

Les emails de confirmation contiendront :
```
http://localhost:5173/confirm-email?token=abc123...
```

## Vérification

### 1. Testez un abonnement en production

1. Allez sur `https://xcafrique.org/subscribe`
2. Abonnez-vous avec un email de test
3. Vérifiez l'email reçu

### 2. Vérifiez l'URL dans l'email

L'email de confirmation doit contenir :
```
✅ Correct : https://xcafrique.org/confirm-email?token=...
```

Et non plus :
```
❌ Incorrect : http://localhost:5173/confirm-email?token=...
❌ Incorrect : http://localhost:5173,http://localhost:3000/confirm-email?token=...
```

### 3. Testez le lien

Cliquez sur le lien dans l'email. Il doit :
- ✅ Rediriger vers `https://xcafrique.org/confirm-email?token=...`
- ✅ Afficher la page de confirmation
- ✅ Confirmer l'abonnement avec succès

## 📋 Checklist de configuration

- [ ] Variable `FRONTEND_URL_PROD` ajoutée sur Vercel
- [ ] Valeur : `https://xcafrique.org`
- [ ] Environnement : Production (et Preview si nécessaire)
- [ ] Backend redéployé après ajout de la variable
- [ ] Test d'abonnement en production effectué
- [ ] Email de confirmation contient la bonne URL
- [ ] Le lien de confirmation fonctionne

## ⚠️ Points importants

1. **Variable backend** : `FRONTEND_URL_PROD` est une variable d'environnement du **backend**, pas du frontend
2. **Redéploiement nécessaire** : Après avoir ajouté la variable, vous devez redéployer le backend
3. **URL sans slash final** : Utilisez `https://xcafrique.org` (sans `/` à la fin)
4. **Page de confirmation** : Assurez-vous que votre frontend a bien une page `/confirm-email` qui gère le paramètre `token`

## 🔍 Dépannage

### Le lien dans l'email contient encore localhost

**Cause** : La variable `FRONTEND_URL_PROD` n'est pas configurée ou le backend n'a pas été redéployé.

**Solution** :
1. Vérifiez que `FRONTEND_URL_PROD` est bien configurée sur Vercel
2. Redéployez le backend
3. Testez à nouveau un abonnement

### Le lien ne fonctionne pas

**Vérifiez** :
1. Que la page `/confirm-email` existe sur le frontend
2. Que la page gère correctement le paramètre `token`
3. Que le frontend est bien déployé sur `https://xcafrique.org`

### Erreur 404 sur le lien

**Cause** : La route `/confirm-email` n'existe pas sur le frontend.

**Solution** : Vérifiez que votre frontend a bien cette route configurée dans le routeur (React Router, etc.)

## 📞 Besoin d'aide ?

Si le problème persiste :
1. Vérifiez les logs du backend lors de l'envoi d'email
2. Vérifiez que la variable est bien accessible dans le code backend
3. Testez avec un email de test et vérifiez le contenu de l'email

---

**Note** : Cette configuration garantit que les emails de confirmation contiennent toujours la bonne URL selon l'environnement (développement ou production).


# 📧 Spécifications Backend - Confirmation d'Email Newsletter

## 🎯 Vue d'ensemble

Ce document décrit les modifications nécessaires dans le backend pour implémenter le système de confirmation d'email pour la newsletter XCAfrique.

---

## 🔄 Flux de confirmation d'email

1. **Abonnement** : L'utilisateur s'abonne via `POST /api/newsletter/subscribe`
2. **Email envoyé** : Le backend envoie un email avec un lien de confirmation
3. **Clic sur le lien** : L'utilisateur clique sur le lien dans l'email
4. **Confirmation** : Le frontend appelle `POST /api/newsletter/confirm` avec le token
5. **Validation** : Le backend valide le token et marque l'email comme confirmé

---

## 📬 1. Modification de l'endpoint d'abonnement

### Endpoint : `POST /api/newsletter/subscribe`

**Modifications requises** :

1. **Générer un token de confirmation unique** :
   - Créer un token unique (UUID, hash, ou token aléatoire sécurisé)
   - Stocker le token dans la base de données avec une date d'expiration (ex: 24-48h)
   - Associer le token à l'email de l'abonné

2. **Envoyer un email de confirmation** :
   - **Expéditeur** : `news@xcafrique.org`
   - **Destinataire** : L'email de l'utilisateur qui s'abonne
   - **Sujet** : "Confirmez votre abonnement à la newsletter XCAfrique"
   - **Lien de confirmation** : `https://votre-domaine.com/confirm-email?token={TOKEN}`
     - En développement : `http://localhost:5173/confirm-email?token={TOKEN}`
   - Le lien doit pointer vers le frontend, pas le backend

3. **Réponse modifiée** :
```json
{
  "success": true,
  "message": "Abonnement réussi. Vérifiez votre boîte mail pour confirmer votre email.",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2024-01-15T10:30:00Z",
    "confirmationRequired": true
  }
}
```

---

## ✅ 2. Nouvel endpoint de confirmation

### Endpoint : `POST /api/newsletter/confirm`

**URL** : `POST /api/newsletter/confirm`

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "token": "abc123def456ghi789..."
}
```

**Réponse Succès (200 OK)** :
```json
{
  "success": true,
  "message": "Votre email a été confirmé avec succès !",
  "data": {
    "email": "user@example.com",
    "confirmedAt": "2024-01-15T11:30:00Z"
  }
}
```

**Réponse Erreur - Token invalide (400 Bad Request)** :
```json
{
  "success": false,
  "message": "Lien de confirmation invalide.",
  "error": "TOKEN_INVALID"
}
```

**Réponse Erreur - Token expiré (410 Gone)** :
```json
{
  "success": false,
  "message": "Ce lien de confirmation a expiré. Veuillez vous réabonner.",
  "error": "TOKEN_EXPIRED"
}
```

**Réponse Erreur - Email déjà confirmé (400 Bad Request)** :
```json
{
  "success": false,
  "message": "Cet email est déjà confirmé.",
  "error": "ALREADY_CONFIRMED"
}
```

---

## 🗄️ 3. Modifications de la base de données

### Table `newsletter_subscribers` - Structure requise

```sql
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  source VARCHAR(50),
  
  -- Champs de confirmation
  confirmation_token VARCHAR(255) UNIQUE,
  confirmation_token_expires_at TIMESTAMP,
  confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMP,
  
  -- Champs de suivi
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_confirmation_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX idx_email ON newsletter_subscribers(email);
CREATE INDEX idx_confirmed ON newsletter_subscribers(confirmed);
```

### Champs à ajouter si la table existe déjà :

```sql
ALTER TABLE newsletter_subscribers
ADD COLUMN confirmation_token VARCHAR(255) UNIQUE,
ADD COLUMN confirmation_token_expires_at TIMESTAMP,
ADD COLUMN confirmed BOOLEAN DEFAULT false,
ADD COLUMN confirmed_at TIMESTAMP;

CREATE INDEX idx_confirmation_token ON newsletter_subscribers(confirmation_token);
```

---

## 🔐 4. Génération et validation du token

### Génération du token

**Recommandations** :
- Utiliser un token cryptographiquement sécurisé (ex: `crypto.randomBytes(32).toString('hex')`)
- Longueur minimale : 32 caractères
- Stocker le hash du token en base (pas le token en clair) pour la sécurité
- OU utiliser un token signé (JWT) avec expiration

**Exemple Node.js** :
```javascript
const crypto = require('crypto');

// Générer un token
const token = crypto.randomBytes(32).toString('hex');

// OU utiliser un token signé avec expiration
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { email: userEmail, type: 'email_confirmation' },
  process.env.JWT_SECRET,
  { expiresIn: '48h' }
);
```

### Validation du token

**Logique de validation** :
1. Vérifier que le token existe dans la base de données
2. Vérifier que le token n'a pas expiré (`confirmation_token_expires_at > NOW()`)
3. Vérifier que l'email n'est pas déjà confirmé (`confirmed = false`)
4. Marquer l'email comme confirmé (`confirmed = true`, `confirmed_at = NOW()`)
5. Optionnel : Supprimer ou invalider le token après utilisation

---

## 📧 5. Template d'email de confirmation

### Email à envoyer lors de l'abonnement

**Expéditeur** : `news@xcafrique.org`  
**Destinataire** : Email de l'utilisateur  
**Sujet** : `Confirmez votre abonnement à la newsletter XCAfrique`

**Contenu HTML (exemple)** :
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenue sur XCAfrique !</h1>
    
    <p>Bonjour,</p>
    
    <p>Merci de vous être abonné à la newsletter XCAfrique. Pour recevoir nos actualités aéronautiques africaines, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
    
    <div style="text-align: center;">
      <a href="{{CONFIRMATION_URL}}" class="button">Confirmer mon email</a>
    </div>
    
    <p>Ou copiez-collez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #666;">{{CONFIRMATION_URL}}</p>
    
    <p><strong>Ce lien expire dans 48 heures.</strong></p>
    
    <p>Si vous n'avez pas demandé cet abonnement, vous pouvez ignorer cet email.</p>
    
    <div class="footer">
      <p>Cordialement,<br>L'équipe XCAfrique</p>
      <p>Email : news@xcafrique.org</p>
    </div>
  </div>
</body>
</html>
```

**Contenu texte (fallback)** :
```
Bienvenue sur XCAfrique !

Bonjour,

Merci de vous être abonné à la newsletter XCAfrique. Pour recevoir nos actualités aéronautiques africaines, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :

{{CONFIRMATION_URL}}

Ce lien expire dans 48 heures.

Si vous n'avez pas demandé cet abonnement, vous pouvez ignorer cet email.

Cordialement,
L'équipe XCAfrique
Email : news@xcafrique.org
```

**Variables à remplacer** :
- `{{CONFIRMATION_URL}}` : URL complète avec le token (ex: `https://votre-domaine.com/confirm-email?token=abc123...`)

---

## 🔄 6. Gestion des cas particuliers

### Email déjà abonné mais non confirmé

**Scénario** : Un utilisateur s'abonne avec un email qui existe déjà mais n'est pas confirmé.

**Comportement recommandé** :
- Régénérer un nouveau token de confirmation
- Mettre à jour la date d'expiration
- Renvoyer l'email de confirmation
- Retourner un message : "Un nouvel email de confirmation a été envoyé."

### Email déjà confirmé

**Scénario** : Un utilisateur essaie de confirmer un email déjà confirmé.

**Comportement recommandé** :
- Retourner un message de succès (pour éviter de révéler des informations)
- OU retourner une erreur : "Cet email est déjà confirmé."

### Token expiré

**Scénario** : Un utilisateur clique sur un lien de confirmation expiré.

**Comportement recommandé** :
- Retourner une erreur `TOKEN_EXPIRED` (410 Gone)
- Optionnel : Proposer de renvoyer un nouvel email de confirmation

### Renvoi d'email de confirmation

**Endpoint optionnel** : `POST /api/newsletter/resend-confirmation`

**Body** :
```json
{
  "email": "user@example.com"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Un nouvel email de confirmation a été envoyé."
}
```

---

## 📊 7. Mise à jour des statistiques

L'endpoint `GET /api/newsletter/stats` doit maintenant retourner :

```json
{
  "success": true,
  "data": {
    "total": 150,
    "confirmed": 120,
    "unconfirmed": 30
  }
}
```

Où :
- `total` : Nombre total d'abonnés (confirmés + non confirmés)
- `confirmed` : Nombre d'abonnés avec `confirmed = true`
- `unconfirmed` : Nombre d'abonnés avec `confirmed = false`

---

## ✅ 8. Checklist de mise en œuvre

### Priorité Haute

- [ ] Modifier `POST /api/newsletter/subscribe` pour générer un token de confirmation
- [ ] Créer l'endpoint `POST /api/newsletter/confirm`
- [ ] Ajouter les champs `confirmation_token`, `confirmation_token_expires_at`, `confirmed`, `confirmed_at` à la table
- [ ] Créer le template d'email de confirmation
- [ ] Configurer l'envoi d'email avec le lien de confirmation
- [ ] Mettre à jour les statistiques pour inclure les abonnés confirmés/non confirmés

### Priorité Moyenne

- [ ] Implémenter la validation du token avec expiration
- [ ] Gérer les cas d'erreur (token invalide, expiré, déjà confirmé)
- [ ] Créer l'endpoint optionnel `POST /api/newsletter/resend-confirmation`

### Priorité Basse

- [ ] Ajouter des logs pour le suivi des confirmations
- [ ] Implémenter un système de nettoyage des tokens expirés (cron job)

---

## 🔗 9. URLs de confirmation

### Développement
```
http://localhost:5173/confirm-email?token={TOKEN}
```

### Production
```
https://votre-domaine.com/confirm-email?token={TOKEN}
```

**Important** : Le backend doit utiliser la variable d'environnement `FRONTEND_URL` pour construire l'URL de confirmation.

**Exemple** :
```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const confirmationUrl = `${FRONTEND_URL}/confirm-email?token=${token}`;
```

---

## 📝 10. Exemple de code backend (pseudo-code)

### Endpoint Subscribe (modifié)

```javascript
POST /api/newsletter/subscribe
async function subscribeNewsletter(req, res) {
  const { email, name, source } = req.body;
  
  // Validation
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Email invalide' });
  }
  
  // Vérifier si l'email existe déjà
  let subscriber = await findSubscriberByEmail(email);
  
  if (subscriber && subscriber.confirmed) {
    return res.status(400).json({ error: 'ALREADY_SUBSCRIBED', message: 'Email déjà abonné' });
  }
  
  // Générer un token de confirmation
  const confirmationToken = generateSecureToken();
  const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h
  
  if (subscriber) {
    // Mettre à jour le token existant
    subscriber.confirmation_token = confirmationToken;
    subscriber.confirmation_token_expires_at = tokenExpiresAt;
    await subscriber.save();
  } else {
    // Créer un nouvel abonné
    subscriber = await createSubscriber({
      email,
      name,
      source,
      confirmation_token: confirmationToken,
      confirmation_token_expires_at: tokenExpiresAt,
      confirmed: false
    });
  }
  
  // Envoyer l'email de confirmation
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const confirmationUrl = `${frontendUrl}/confirm-email?token=${confirmationToken}`;
  
  await sendConfirmationEmail(email, confirmationUrl);
  
  return res.status(200).json({
    success: true,
    message: 'Abonnement réussi. Vérifiez votre boîte mail pour confirmer votre email.',
    data: {
      email: subscriber.email,
      subscribedAt: subscriber.subscribed_at
    }
  });
}
```

### Endpoint Confirm (nouveau)

```javascript
POST /api/newsletter/confirm
async function confirmEmail(req, res) {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'TOKEN_REQUIRED', message: 'Token manquant' });
  }
  
  // Trouver l'abonné par token
  const subscriber = await findSubscriberByToken(token);
  
  if (!subscriber) {
    return res.status(400).json({ error: 'TOKEN_INVALID', message: 'Lien de confirmation invalide' });
  }
  
  // Vérifier si le token a expiré
  if (new Date() > subscriber.confirmation_token_expires_at) {
    return res.status(410).json({ error: 'TOKEN_EXPIRED', message: 'Ce lien de confirmation a expiré' });
  }
  
  // Vérifier si déjà confirmé
  if (subscriber.confirmed) {
    return res.status(400).json({ error: 'ALREADY_CONFIRMED', message: 'Cet email est déjà confirmé' });
  }
  
  // Confirmer l'email
  subscriber.confirmed = true;
  subscriber.confirmed_at = new Date();
  subscriber.confirmation_token = null; // Optionnel : invalider le token
  await subscriber.save();
  
  return res.status(200).json({
    success: true,
    message: 'Votre email a été confirmé avec succès !',
    data: {
      email: subscriber.email,
      confirmedAt: subscriber.confirmed_at
    }
  });
}
```

---

## 🎯 Résumé pour le backend

**Actions principales** :

1. ✅ Modifier `POST /api/newsletter/subscribe` pour générer un token et envoyer un email
2. ✅ Créer `POST /api/newsletter/confirm` pour valider le token et confirmer l'email
3. ✅ Ajouter les champs de confirmation dans la base de données
4. ✅ Créer le template d'email avec le lien de confirmation
5. ✅ Utiliser `FRONTEND_URL` pour construire l'URL de confirmation

**Format du lien de confirmation** :
```
{FRONTEND_URL}/confirm-email?token={TOKEN}
```

Le frontend est déjà prêt à recevoir ces requêtes ! 🚀


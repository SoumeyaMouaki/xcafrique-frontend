# 🚀 Prompt Backend - Confirmation d'Email Newsletter

## Contexte
Le frontend nécessite un système de confirmation d'email pour la newsletter. Actuellement, les utilisateurs peuvent s'abonner mais ne peuvent pas confirmer leur email.

## Actions requises

### 1. Modifier l'endpoint d'abonnement (URGENT)

**Endpoint** : `POST /api/newsletter/subscribe`

**Modifications** :
- ✅ Générer un token de confirmation unique lors de l'abonnement
- ✅ Stocker le token avec une date d'expiration (48h recommandé)
- ✅ Envoyer un email de confirmation avec le lien

**Format du lien de confirmation** :
```
{FRONTEND_URL}/confirm-email?token={TOKEN}
```
- En développement : `http://localhost:5173/confirm-email?token={TOKEN}`
- En production : `https://votre-domaine.com/confirm-email?token={TOKEN}`

**Réponse modifiée** :
```json
{
  "success": true,
  "message": "Abonnement réussi. Vérifiez votre boîte mail pour confirmer votre email.",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Créer l'endpoint de confirmation (URGENT)

**Endpoint** : `POST /api/newsletter/confirm`

**Requête** :
```json
{
  "token": "abc123def456..."
}
```

**Réponse Succès (200)** :
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

**Réponses d'erreur** :
- **400** : Token invalide → `{ "error": "TOKEN_INVALID", "message": "Lien de confirmation invalide." }`
- **410** : Token expiré → `{ "error": "TOKEN_EXPIRED", "message": "Ce lien de confirmation a expiré." }`
- **400** : Déjà confirmé → `{ "error": "ALREADY_CONFIRMED", "message": "Cet email est déjà confirmé." }`

**Logique** :
1. Vérifier que le token existe
2. Vérifier que le token n'a pas expiré
3. Vérifier que l'email n'est pas déjà confirmé
4. Marquer l'email comme confirmé (`confirmed = true`, `confirmed_at = NOW()`)

---

### 3. Modifier la base de données (URGENT)

**Ajouter ces champs à la table `newsletter_subscribers`** :
```sql
ALTER TABLE newsletter_subscribers
ADD COLUMN confirmation_token VARCHAR(255) UNIQUE,
ADD COLUMN confirmation_token_expires_at TIMESTAMP,
ADD COLUMN confirmed BOOLEAN DEFAULT false,
ADD COLUMN confirmed_at TIMESTAMP;

CREATE INDEX idx_confirmation_token ON newsletter_subscribers(confirmation_token);
```

**Structure complète** :
- `confirmation_token` : Token unique pour la confirmation
- `confirmation_token_expires_at` : Date d'expiration (ex: 48h après génération)
- `confirmed` : Boolean (false par défaut)
- `confirmed_at` : Timestamp de confirmation

---

### 4. Email de confirmation (URGENT)

**Expéditeur** : `news@xcafrique.org`  
**Destinataire** : Email de l'utilisateur  
**Sujet** : `Confirmez votre abonnement à la newsletter XCAfrique`

**Contenu** :
- Message de bienvenue
- Bouton/lien de confirmation : `{FRONTEND_URL}/confirm-email?token={TOKEN}`
- Mention que le lien expire dans 48h
- Signature : "L'équipe XCAfrique"

**Template HTML recommandé** :
```html
<h1>Bienvenue sur XCAfrique !</h1>
<p>Merci de vous être abonné. Cliquez sur le lien ci-dessous pour confirmer votre email :</p>
<a href="{{CONFIRMATION_URL}}">Confirmer mon email</a>
<p>Ce lien expire dans 48 heures.</p>
```

---

### 5. Mise à jour des statistiques

L'endpoint `GET /api/newsletter/stats` doit retourner :
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
- `total` : Tous les abonnés (confirmés + non confirmés)
- `confirmed` : Abonnés avec `confirmed = true`
- `unconfirmed` : Abonnés avec `confirmed = false`

---

## Variables d'environnement nécessaires

```env
FRONTEND_URL=http://localhost:5173  # En développement
# FRONTEND_URL=https://votre-domaine.com  # En production
NEWSLETTER_EMAIL=news@xcafrique.org
```

---

## Résumé rapide

1. ✅ Modifier `POST /api/newsletter/subscribe` → Générer token + Envoyer email
2. ✅ Créer `POST /api/newsletter/confirm` → Valider token + Confirmer email
3. ✅ Ajouter champs DB : `confirmation_token`, `confirmation_token_expires_at`, `confirmed`, `confirmed_at`
4. ✅ Créer template email avec lien : `{FRONTEND_URL}/confirm-email?token={TOKEN}`
5. ✅ Mettre à jour les stats pour inclure confirmés/non confirmés

**Le frontend est déjà prêt !** Il attend ces endpoints. 🚀

---

## Documentation complète

Voir `BACKEND_EMAIL_CONFIRMATION.md` pour les détails complets, exemples de code, et cas particuliers.


# 📋 Spécifications Backend - Modifications XCAfrique

## 🎯 Vue d'ensemble

Ce document décrit les modifications nécessaires dans le backend suite aux changements effectués dans le frontend :
- Changement de nom : **XCAfrica** → **XCAfrique**
- Nouveaux emails : `contact@xcafrique.org` et `news@xcafrique.org`
- Nouvelle page d'abonnement newsletter

---

## 📧 1. Mise à jour des emails

### Emails à utiliser

- **Contact général** : `contact@xcafrique.org`
  - Utilisé pour le formulaire de contact (`/contact`)
  - Endpoint : `POST /api/contact`

- **Newsletter** : `news@xcafrique.org`
  - Utilisé pour les abonnements à la newsletter
  - Endpoint : `POST /api/newsletter/subscribe`

### Actions requises

1. **Mettre à jour les variables d'environnement** :
   ```env
   CONTACT_EMAIL=contact@xcafrique.org
   NEWSLETTER_EMAIL=news@xcafrique.org
   ```

2. **Mettre à jour la configuration d'envoi d'emails** :
   - Vérifier que les emails sortants utilisent les bonnes adresses
   - Mettre à jour les templates d'emails pour utiliser `contact@xcafrique.org` comme expéditeur pour les contacts
   - Mettre à jour les templates d'emails pour utiliser `news@xcafrique.org` comme expéditeur pour les newsletters

---

## 📬 2. Endpoint Newsletter - Nouvelle fonctionnalité

### Endpoint à créer : `POST /api/newsletter/subscribe`

Le frontend envoie maintenant des requêtes d'abonnement à la newsletter via cet endpoint.

#### Requête

**URL** : `POST /api/newsletter/subscribe`

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "email": "user@example.com",
  "name": "Nom de l'utilisateur" (optionnel),
  "source": "website"
}
```

**Exemple de requête** :
```json
{
  "email": "jean.dupont@example.com",
  "name": "Jean Dupont",
  "source": "website"
}
```

#### Réponse

**Succès (200 OK)** :
```json
{
  "success": true,
  "message": "Abonnement réussi. Vérifiez votre boîte mail pour confirmer.",
  "data": {
    "email": "jean.dupont@example.com",
    "subscribedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreur - Email déjà abonné (400 Bad Request)** :
```json
{
  "success": false,
  "message": "Cet email est déjà abonné à la newsletter.",
  "error": "EMAIL_ALREADY_SUBSCRIBED"
}
```

**Erreur - Email invalide (400 Bad Request)** :
```json
{
  "success": false,
  "message": "Veuillez fournir une adresse email valide.",
  "error": "INVALID_EMAIL"
}
```

**Erreur - Email manquant (400 Bad Request)** :
```json
{
  "success": false,
  "message": "L'adresse email est requise.",
  "error": "EMAIL_REQUIRED"
}
```

**Erreur serveur (500 Internal Server Error)** :
```json
{
  "success": false,
  "message": "Impossible de vous abonner pour le moment. Veuillez réessayer plus tard.",
  "error": "SERVER_ERROR"
}
```

### Spécifications techniques

1. **Validation** :
   - Vérifier que l'email est valide (format email)
   - Vérifier que l'email n'est pas déjà dans la base de données
   - Le champ `name` est optionnel
   - Le champ `source` peut être utilisé pour le tracking

2. **Base de données** :
   - Créer/ajouter une table `newsletter_subscribers` si elle n'existe pas :
     ```sql
     CREATE TABLE newsletter_subscribers (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       name VARCHAR(255),
       source VARCHAR(50),
       subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       confirmed BOOLEAN DEFAULT false,
       confirmed_at TIMESTAMP,
       unsubscribed_at TIMESTAMP,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

3. **Email de confirmation** :
   - Envoyer un email de confirmation à `news@xcafrique.org`
   - Optionnel : Envoyer un email de bienvenue à l'utilisateur
   - Template d'email à utiliser : `news@xcafrique.org` comme expéditeur

4. **Gestion des doublons** :
   - Si l'email existe déjà mais n'est pas confirmé, renvoyer l'email de confirmation
   - Si l'email existe et est confirmé, retourner un message approprié

---

## 🏷️ 3. Mise à jour du nom de marque

### Changements de nom

- **Ancien nom** : XCAfrica
- **Nouveau nom** : XCAfrique

### Actions requises

1. **Mettre à jour les templates d'emails** :
   - Remplacer toutes les occurrences de "XCAfrica" par "XCAfrique" dans :
     - Emails de confirmation de contact
     - Emails de confirmation d'abonnement newsletter
     - Emails de bienvenue
     - Emails de notification

2. **Mettre à jour les métadonnées** :
   - Nom de l'application dans les emails
   - Signature des emails
   - Sujets des emails

3. **Mettre à jour la documentation API** :
   - Swagger/OpenAPI si applicable
   - README du backend

---

## 📝 4. Endpoint Contact existant

### Vérification : `POST /api/contact`

Assurez-vous que cet endpoint :
- Utilise `contact@xcafrique.org` comme email de destination
- Utilise `contact@xcafrique.org` comme expéditeur dans les réponses automatiques
- Contient "XCAfrique" (et non "XCAfrica") dans les templates d'emails

**Structure de requête attendue** (déjà en place) :
```json
{
  "name": "Nom complet",
  "email": "user@example.com",
  "subject": "Sujet (optionnel)",
  "message": "Message du contact"
}
```

---

## 🔧 5. Checklist de mise en œuvre

### Priorité Haute

- [ ] Créer l'endpoint `POST /api/newsletter/subscribe`
- [ ] Mettre à jour les variables d'environnement avec les nouveaux emails
- [ ] Créer/mettre à jour la table `newsletter_subscribers` en base de données
- [ ] Mettre à jour les templates d'emails avec "XCAfrique"

### Priorité Moyenne

- [ ] Implémenter la validation des emails
- [ ] Implémenter la gestion des doublons
- [ ] Créer les templates d'emails de confirmation newsletter
- [ ] Tester l'envoi d'emails avec les nouvelles adresses

### Priorité Basse

- [ ] Ajouter un système de double opt-in (confirmation par email)
- [ ] Ajouter des statistiques d'abonnement
- [ ] Créer un endpoint pour se désabonner (`POST /api/newsletter/unsubscribe`)
- [ ] Mettre à jour la documentation API

---

## 🧪 6. Tests recommandés

### Tests unitaires

1. **Validation email** :
   - Email valide → Succès
   - Email invalide → Erreur 400
   - Email manquant → Erreur 400

2. **Gestion des doublons** :
   - Email déjà existant → Message approprié
   - Email existant non confirmé → Renvoyer confirmation

3. **Envoi d'emails** :
   - Vérifier que les emails sont envoyés depuis `news@xcafrique.org`
   - Vérifier que les emails de contact sont envoyés depuis `contact@xcafrique.org`

### Tests d'intégration

1. Tester le flux complet d'abonnement depuis le frontend
2. Vérifier la réception des emails
3. Vérifier l'enregistrement en base de données

---

## 📚 7. Exemples de code (référence)

### Exemple Node.js/Express

```javascript
// routes/newsletter.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const NewsletterService = require('../services/NewsletterService');

router.post('/subscribe', 
  [
    body('email').isEmail().normalizeEmail(),
    body('name').optional().trim(),
    body('source').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Email invalide',
          error: 'INVALID_EMAIL',
          errors: errors.array()
        });
      }

      const { email, name, source } = req.body;
      
      const result = await NewsletterService.subscribe(email, name, source);
      
      res.status(200).json({
        success: true,
        message: 'Abonnement réussi. Vérifiez votre boîte mail pour confirmer.',
        data: result
      });
    } catch (error) {
      if (error.code === 'EMAIL_ALREADY_SUBSCRIBED') {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: 'EMAIL_ALREADY_SUBSCRIBED'
        });
      }
      
      console.error('Erreur abonnement newsletter:', error);
      res.status(500).json({
        success: false,
        message: 'Impossible de vous abonner pour le moment. Veuillez réessayer plus tard.',
        error: 'SERVER_ERROR'
      });
    }
  }
);

module.exports = router;
```

### Exemple Python/Flask

```python
# routes/newsletter.py
from flask import Blueprint, request, jsonify
from validators import email as email_validator
from services.newsletter_service import NewsletterService

newsletter_bp = Blueprint('newsletter', __name__)

@newsletter_bp.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.get_json()
        email = data.get('email')
        name = data.get('name')
        source = data.get('source', 'website')
        
        # Validation
        if not email:
            return jsonify({
                'success': False,
                'message': 'L\'adresse email est requise.',
                'error': 'EMAIL_REQUIRED'
            }), 400
        
        if not email_validator(email):
            return jsonify({
                'success': False,
                'message': 'Veuillez fournir une adresse email valide.',
                'error': 'INVALID_EMAIL'
            }), 400
        
        # Service
        result = NewsletterService.subscribe(email, name, source)
        
        return jsonify({
            'success': True,
            'message': 'Abonnement réussi. Vérifiez votre boîte mail pour confirmer.',
            'data': result
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 'EMAIL_ALREADY_SUBSCRIBED'
        }), 400
    except Exception as e:
        print(f'Erreur abonnement newsletter: {e}')
        return jsonify({
            'success': False,
            'message': 'Impossible de vous abonner pour le moment. Veuillez réessayer plus tard.',
            'error': 'SERVER_ERROR'
        }), 500
```

---

## 📞 8. Support

Si vous avez des questions ou besoin de clarifications sur ces spécifications, n'hésitez pas à contacter l'équipe frontend.

**Email de contact** : contact@xcafrique.org

---

**Date de création** : 2024  
**Version** : 1.0  
**Dernière mise à jour** : Suite aux modifications frontend XCAfrique


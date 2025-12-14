# 🚀 Prompt pour l'équipe Backend - Modifications XCAfrique

## Contexte
Le frontend a été mis à jour avec les changements suivants :
- **Changement de nom** : XCAfrica → **XCAfrique**
- **Nouveaux emails** : `contact@xcafrique.org` et `news@xcafrique.org`
- **Nouvelle page d'abonnement** newsletter

## Actions requises du Backend

### 1. Créer l'endpoint Newsletter (URGENT)
**Endpoint à créer** : `POST /api/newsletter/subscribe`

**Requête** :
```json
{
  "email": "user@example.com",
  "name": "Nom (optionnel)",
  "source": "website"
}
```

**Réponse succès (200)** :
```json
{
  "success": true,
  "message": "Abonnement réussi. Vérifiez votre boîte mail pour confirmer.",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Réponses d'erreur** :
- 400 : Email invalide ou déjà abonné
- 500 : Erreur serveur

**Fonctionnalités** :
- Valider le format email
- Vérifier les doublons
- Enregistrer en base de données
- Envoyer un email de confirmation depuis `news@xcafrique.org`

---

### 2. Mettre à jour les emails (URGENT)

**Variables d'environnement** :
```env
CONTACT_EMAIL=contact@xcafrique.org
NEWSLETTER_EMAIL=news@xcafrique.org
```

**Actions** :
- Mettre à jour tous les templates d'emails pour utiliser ces nouvelles adresses
- Utiliser `contact@xcafrique.org` pour les emails de contact
- Utiliser `news@xcafrique.org` pour les emails de newsletter

---

### 3. Mettre à jour le nom de marque (IMPORTANT)

**Changement** : XCAfrica → **XCAfrique**

**Actions** :
- Remplacer "XCAfrica" par "XCAfrique" dans tous les templates d'emails
- Mettre à jour les signatures d'emails
- Mettre à jour les sujets d'emails

---

### 4. Base de données Newsletter

**Table à créer** (si elle n'existe pas) :
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

---

## Priorités

🔴 **URGENT** :
1. Créer l'endpoint `/api/newsletter/subscribe`
2. Mettre à jour les emails dans les variables d'environnement

🟡 **IMPORTANT** :
3. Mettre à jour les templates d'emails avec "XCAfrique"
4. Créer la table newsletter_subscribers

🟢 **OPTIONNEL** :
5. Système de double opt-in
6. Endpoint de désabonnement

---

## Documentation complète

Voir le fichier `BACKEND_SPECIFICATIONS.md` pour les détails complets, exemples de code, et spécifications techniques.

---

**Contact** : Pour toute question, contactez l'équipe frontend ou utilisez contact@xcafrique.org


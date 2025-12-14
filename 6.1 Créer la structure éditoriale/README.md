# 📝 Structure Éditoriale - XC Afrique

Ce dossier contient tous les éléments nécessaires pour gérer le contenu éditorial du blog XC Afrique.

## 📁 Organisation

```
6.1 Créer la structure éditoriale/
├── README.md              # Ce fichier - Documentation de la structure
├── articles/              # Articles rédactionnels
│   ├── .gitkeep
│   ├── drafts/            # Articles en attente de révision
│   │   └── .gitkeep
│   ├── published/         # Articles validés et prêts
│   │   └── .gitkeep
│   └── exemple-article.json  # Exemple de structure d'article
├── templates/             # Modèles pour créer de nouveaux articles
│   ├── article-standard.json
│   ├── article-featured.json
│   └── article-video.json
└── assets/                # Ressources visuelles pour les articles
    ├── images/
    │   └── .gitkeep
    └── icons/
        └── .gitkeep
```

## 🎯 Objectif

Cette structure permet de :
- **Organiser** les articles de manière structurée
- **Standardiser** le format des articles avec des templates
- **Centraliser** les ressources visuelles (images, icônes)
- **Faciliter** la création de nouveaux contenus

## 📋 Format des Articles

Chaque article suit une structure JSON standardisée compatible avec le backend et le frontend :

```json
{
  "title": "Titre de l'article",
  "excerpt": "Résumé court de l'article",
  "content": "Contenu complet en HTML ou Markdown",
  "category": "Nom de la catégorie",
  "author": "Nom de l'auteur",
  "image": "URL de l'image principale",
  "featured": false,
  "publishedAt": "2025-01-XX",
  "tags": ["tag1", "tag2"]
}
```

## 🔄 Workflow Éditorial

1. **Création** : Utiliser un template depuis `templates/`
2. **Rédaction** : Créer l'article dans `articles/drafts/` (brouillons)
3. **Validation** : Révision et validation du contenu par un éditeur humain
4. **Publication** : Une fois validé, déplacer vers `articles/published/`
5. **Intégration** : Transfert vers le backend via API depuis `published/`
6. **Ressources** : Ajouter les images dans `assets/images/`

### Dossiers de workflow

- **`articles/drafts/`** : Articles générés automatiquement ou en cours de rédaction, en attente de révision humaine
- **`articles/published/`** : Articles validés et approuvés, prêts pour la publication sur le site

## 📝 Templates Disponibles

- **article-standard.json** : Article standard
- **article-featured.json** : Article mis en avant (à la une)
- **article-video.json** : Article avec contenu vidéo intégré

## 🖼️ Gestion des Assets

- **images/** : Images d'illustration pour les articles
- **icons/** : Icônes et éléments graphiques

## ⚠️ Notes Importantes

- Les articles doivent respecter la structure JSON définie
- Les images doivent être optimisées avant ajout
- Les dates doivent être au format ISO (YYYY-MM-DD)
- Les catégories doivent correspondre à celles du backend

## 🔗 Intégration

Cette structure s'intègre avec :
- Le workflow éditorial (drafts → published) intégré dans `articles/`
- Le backend API pour la publication
- Le frontend React pour l'affichage


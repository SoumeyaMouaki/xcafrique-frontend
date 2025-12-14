# 🖼️ Assets - Ressources Visuelles

Ce dossier contient toutes les ressources visuelles utilisées dans les articles.

## 📁 Structure

```
assets/
├── images/          # Images d'illustration pour les articles
│   ├── articles/    # Images spécifiques aux articles
│   ├── featured/    # Images pour les articles mis en avant
│   └── thumbnails/ # Miniatures et vignettes
└── icons/           # Icônes et éléments graphiques
    ├── categories/  # Icônes de catégories
    └── social/      # Icônes de réseaux sociaux
```

## 📋 Guidelines

### Images

- **Format recommandé** : JPG ou PNG
- **Taille optimale** : 
  - Image principale : 1200x630px (ratio 1.91:1)
  - Image featured : 1920x1080px (ratio 16:9)
  - Thumbnail : 400x300px (ratio 4:3)
- **Poids maximum** : 500KB par image
- **Optimisation** : Compresser les images avant ajout

### Icônes

- **Format recommandé** : SVG (préféré) ou PNG
- **Taille** : 24x24px, 32x32px, ou 48x48px selon l'usage
- **Style** : Cohérent avec l'identité visuelle XC Afrique

## 🔄 Workflow

1. Ajouter les images dans le dossier approprié
2. Nommer les fichiers de manière descriptive (ex: `article-aviation-afrique-2025.jpg`)
3. Référencer les images dans les articles JSON avec le chemin relatif ou URL
4. Optimiser les images avant publication

## ⚠️ Notes

- Ne pas commiter d'images trop volumineuses (>1MB)
- Utiliser des noms de fichiers sans espaces ni caractères spéciaux
- Préférer les URLs externes (CDN) pour les images en production


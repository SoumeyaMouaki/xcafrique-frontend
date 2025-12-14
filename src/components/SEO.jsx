import { useEffect } from 'react'

/**
 * Composant SEO - Gère les balises meta dynamiques pour le SEO
 * 
 * @param {string} title - Titre de la page
 * @param {string} description - Description meta
 * @param {string} keywords - Mots-clés (optionnel)
 * @param {string} image - Image pour les réseaux sociaux (optionnel)
 */
const SEO = ({ title, description, keywords, image }) => {
  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = title || "XC Afrique - Le Cross-check de l'info aérienne"

    // Mettre à jour ou créer la meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description || "XC Afrique - Le Cross-check de l'info aérienne. Blog professionnel d'actualité aéronautique en Afrique.")

    // Mettre à jour ou créer les meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords)
    }

    // Meta tags pour les réseaux sociaux (Open Graph)
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: 'website' },
    ]

    ogTags.forEach(tag => {
      if (tag.content) {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`)
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.setAttribute('property', tag.property)
          document.head.appendChild(metaTag)
        }
        metaTag.setAttribute('content', tag.content)
      }
    })

    // Twitter Card
    if (title) {
      let twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (!twitterTitle) {
        twitterTitle = document.createElement('meta')
        twitterTitle.setAttribute('name', 'twitter:title')
        document.head.appendChild(twitterTitle)
      }
      twitterTitle.setAttribute('content', title)
    }

    if (description) {
      let twitterDescription = document.querySelector('meta[name="twitter:description"]')
      if (!twitterDescription) {
        twitterDescription = document.createElement('meta')
        twitterDescription.setAttribute('name', 'twitter:description')
        document.head.appendChild(twitterDescription)
      }
      twitterDescription.setAttribute('content', description)
    }
  }, [title, description, keywords, image])

  return null
}

export default SEO


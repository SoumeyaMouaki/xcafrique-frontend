import { useState } from 'react'
import { shareArticle } from '../services/articles'
import { SITE_URL } from '../api'

/**
 * Composant ShareButtons - Boutons de partage d'article avec compteur
 * @param {Object} props
 * @param {Object} props.article - L'article à partager
 * @param {Function} props.onShareUpdate - Callback appelé après un partage réussi (optionnel)
 */
const ShareButtons = ({ article, onShareUpdate }) => {
  const [shareCount, setShareCount] = useState(article?.shareCount || 0)
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!article || !article.slug) {
    return null
  }

  const handleShare = async (platform) => {
    try {
      setIsSharing(true)
      
      // Construire l'URL absolue de l'article
      const url = `${SITE_URL}/article/${encodeURIComponent(article.slug)}`
      const title = article.title || 'XC Afrique'
      
      // Ouvrir la fenêtre de partage selon la plateforme
      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank',
            'width=600,height=400'
          )
          break
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            '_blank',
            'width=600,height=400'
          )
          break
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank',
            'width=600,height=400'
          )
          break
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
            '_blank'
          )
          break
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
          break
        case 'copy':
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            // Pas besoin d'attendre la réponse API pour le copy
            return
          } catch (err) {
            console.error('Erreur lors de la copie:', err)
            // Fallback pour les navigateurs plus anciens
            const textArea = document.createElement('textarea')
            textArea.value = url
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            return
          }
        default:
          break
      }
      
      // Enregistrer le partage dans la base de données
      // Ne pas bloquer l'utilisateur si l'enregistrement échoue
      try {
        const response = await shareArticle(article.slug, platform)
        
        if (response.success && response.data) {
          const newShareCount = response.data.shareCount || shareCount + 1
          setShareCount(newShareCount)
          
          // Appeler le callback si fourni
          if (onShareUpdate) {
            onShareUpdate(newShareCount)
          }
          
          console.log(`✅ Partage enregistré ! Total: ${newShareCount}`)
        }
      } catch (apiError) {
        // Ne pas bloquer l'utilisateur même si l'enregistrement échoue
        console.warn('⚠️ Partage effectué mais enregistrement échoué:', apiError)
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h3 className="text-lg font-semibold text-primary-dark mb-4">
        Partager cet article
      </h3>
      
      {/* Compteur de partages */}
      {shareCount > 0 && (
        <div className="mb-4 text-sm text-gray-600 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="font-medium">
            {shareCount} partage{shareCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {/* Boutons de partage */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleShare('facebook')}
          disabled={isSharing}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:bg-[#166fe5] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Partager sur Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
          <span>Facebook</span>
        </button>
        
        <button
          onClick={() => handleShare('twitter')}
          disabled={isSharing}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1da1f2] text-white rounded-lg hover:bg-[#1a91da] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Partager sur Twitter"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
          <span>Twitter</span>
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          disabled={isSharing}
          className="flex items-center space-x-2 px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006399] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Partager sur LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span>LinkedIn</span>
        </button>
        
        <button
          onClick={() => handleShare('whatsapp')}
          disabled={isSharing}
          className="flex items-center space-x-2 px-4 py-2 bg-[#25d366] text-white rounded-lg hover:bg-[#20ba5a] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Partager sur WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span>WhatsApp</span>
        </button>
        
        <button
          onClick={() => handleShare('email')}
          disabled={isSharing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Partager par email"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Email</span>
        </button>
        
        <button
          onClick={() => handleShare('copy')}
          disabled={isSharing}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
            copied 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-[#17a2b8] text-white hover:bg-[#138496]'
          }`}
          aria-label="Copier le lien"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copié !</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ShareButtons


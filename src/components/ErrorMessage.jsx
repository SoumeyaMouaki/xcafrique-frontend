import { Link } from 'react-router-dom'

/**
 * Composant ErrorMessage - Affichage d'erreur avec option de retry
 */
const ErrorMessage = ({ 
  message = "Une erreur s'est produite", 
  onRetry = null,
  showHomeLink = true,
  isCors = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`${isCors ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-red-50 border-2 border-red-200'} rounded-lg p-6 max-w-2xl w-full`}>
        <div className="mb-4 text-center">
          <svg 
            className={`w-16 h-16 ${isCors ? 'text-yellow-600' : 'text-red-500'} mx-auto`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isCors ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            )}
          </svg>
        </div>
        <h3 className={`text-lg font-semibold ${isCors ? 'text-yellow-800' : 'text-red-800'} mb-2 text-center`}>
          {isCors ? '⚠️ Erreur CORS détectée' : 'Oups !'}
        </h3>
        <p className={`${isCors ? 'text-yellow-700' : 'text-red-700'} mb-4 text-center`}>
          {message}
        </p>
        {isCors && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
            <p className="text-sm text-gray-700 mb-2 font-semibold">Solution rapide :</p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Arrêtez le serveur de développement (Ctrl+C)</li>
              <li>Redémarrez avec <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
              <li>Le proxy Vite devrait résoudre le problème CORS</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">
              Consultez <code className="bg-gray-100 px-1 py-0.5 rounded">CORS_FIX.md</code> pour plus de détails.
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary"
            >
              Réessayer
            </button>
          )}
          {showHomeLink && (
            <Link
              to="/"
              className="btn-secondary"
            >
              Retour à l'accueil
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage


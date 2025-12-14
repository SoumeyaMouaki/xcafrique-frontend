/**
 * Composant LoadingSpinner - Indicateur de chargement moderne
 */
const LoadingSpinner = ({ size = 'md', text = 'Chargement...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fadeIn">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-primary-light border-t-primary-dark rounded-full animate-spin`}></div>
        <div className={`${sizeClasses[size]} border-accent-orange border-t-transparent rounded-full animate-spin absolute top-0 left-0 opacity-50`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      {text && (
        <p className={`mt-4 text-gray-600 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner


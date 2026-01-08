import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from '../api'
import { extractApiData, handleApiError } from '../utils/apiHelpers'
import LoadingSpinner from './LoadingSpinner'

/**
 * Composant CategoryList - Liste des catégories disponibles
 * Affiche toutes les catégories sous forme de liens récupérées depuis l'API
 */
const CategoryList = ({ categories: propCategories = null }) => {
  const [categories, setCategories] = useState(propCategories || [])
  const [loading, setLoading] = useState(!propCategories)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Si les catégories sont passées en props, ne pas les récupérer
    if (propCategories) {
      setCategories(propCategories)
      return
    }

    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(false)
        const res = await API.get('/categories')
        const cats = extractApiData(res)
        setCategories(cats)
      } catch (err) {
        console.error('Erreur récupération catégories:', handleApiError(err))
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [propCategories])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <LoadingSpinner size="sm" text="" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">
          Catégories
        </h2>
        <p className="text-red-600 text-sm">Erreur de chargement</p>
      </div>
    )
  }

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase()
    
    if (name.includes('fleet') || name.includes('flotte')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    }
    if (name.includes('infrastructure') || name.includes('airport')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
    if (name.includes('training') || name.includes('formation')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
    if (name.includes('safety') || name.includes('sécurité')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
    if (name.includes('technology') || name.includes('technologie')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
    if (name.includes('cargo') || name.includes('fret')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
    if (name.includes('commercial')) {
      return (
        <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
    // Icône par défaut moderne
    return (
      <svg className="w-5 h-5 mr-2 text-accent-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary-dark">
        Catégories
      </h2>
      <ul className="space-y-2">
        <li>
          <Link
            to="/categories"
            className="text-gray-700 hover:text-primary-dark hover:font-medium transition-colors flex items-center py-2 px-3 rounded-lg hover:bg-white group"
          >
            <svg className="w-5 h-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Toutes les catégories
          </Link>
        </li>
        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryName = category.name || category
            const categorySlug = category.slug || categoryName
            const categoryId = category._id || category.id || categorySlug
            return (
              <li key={categoryId}>
                <Link
                  to={`/categories/${encodeURIComponent(categorySlug)}`}
                  className="text-gray-700 hover:text-primary-dark hover:font-medium transition-colors flex items-center py-2 px-3 rounded-lg hover:bg-white group"
                >
                  {getCategoryIcon(categoryName)}
                  {categoryName}
                  {category.articleCount !== undefined && (
                    <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {category.articleCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })
        ) : (
          <li className="text-gray-500 text-sm py-2">Aucune catégorie disponible</li>
        )}
      </ul>
    </div>
  )
}

export default CategoryList


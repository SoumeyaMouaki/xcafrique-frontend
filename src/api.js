import axios from "axios";

// Configuration de l'API avec baseURL depuis les variables d'environnement ou valeur par défaut
// En développement avec proxy Vite, on utilise /api directement
// En production, on utilise l'URL complète depuis les variables d'environnement
const getApiBaseUrl = () => {
  // Vérifier si on est en développement local (localhost)
  const isLocalDev = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost')
  
  // En développement local, toujours utiliser le proxy Vite
  if (isLocalDev) {
    return "/api"
  }
  
  // En production (déployé), utiliser l'URL du backend déployé
  // Priorité : VITE_API_URL depuis les variables d'environnement Vercel
    const baseUrl = import.meta.env.VITE_API_URL || 'https://xcafrique-backend.vercel.app'
  
    // Nettoyer l'URL si elle contient déjà /api
    const cleanUrl = baseUrl.replace(/\/api\/?$/, '')
  
    // Ajouter /api à la fin
    return `${cleanUrl}/api`
}

const API_BASE_URL = getApiBaseUrl()

// Log pour déboguer (toujours actif pour voir la config en production)
console.log('🔧 Configuration API:', {
  hostname: window.location.hostname,
  isLocalDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  apiBaseUrl: API_BASE_URL,
  envProd: import.meta.env.PROD,
  viteApiUrl: import.meta.env.VITE_API_URL,
  mode: import.meta.env.MODE
})

// URL du site pour les partages et liens
export const SITE_URL = import.meta.env.VITE_SITE_URL || (import.meta.env.PROD ? "https://xcafrique.org" : window.location.origin);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Injecter automatiquement le token dans les headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion des erreurs globales
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      // Erreur 401 - Non autorisé
      if (error.response.status === 401) {
        localStorage.removeItem("token");
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;

import axios from "axios";

// Configuration de l'API avec baseURL depuis les variables d'environnement ou valeur par défaut
// En développement avec proxy Vite, on utilise /api directement
// En production, on utilise l'URL complète depuis les variables d'environnement
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  : "/api"; // Utilise le proxy Vite en développement

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
    // Détection des erreurs CORS
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // Vérifier si c'est une erreur CORS
      if (error.message.includes('CORS') || 
          (error.request && error.request.status === 0)) {
        console.error(
          '❌ Erreur CORS détectée!\n' +
          'Le backend autorise uniquement http://localhost:3000 mais Vite tourne sur http://localhost:5173.\n' +
          'Solution: Le proxy Vite est configuré. Redémarrez le serveur de développement avec "npm run dev".\n' +
          'Si le problème persiste, vérifiez la configuration CORS du backend.'
        );
      } else {
        console.error('Erreur de connexion au serveur. Vérifiez que le backend est démarré sur http://localhost:5000');
      }
    }
    
    // Gestion des erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout: Le serveur met trop de temps à répondre (>10s)');
    }
    
    // Gestion des erreurs HTTP
    if (error.response) {
      // Erreur 401 - Non autorisé
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Optionnel: rediriger vers la page de login
      }
      
      // Erreur CORS (peut apparaître comme 0 ou pas de status)
      if (error.response.status === 0 || 
          (error.response.headers && error.response.headers['access-control-allow-origin'])) {
        console.error(
          '❌ Erreur CORS: Le backend n\'autorise pas les requêtes depuis cette origine.\n' +
          'Vérifiez que le backend autorise http://localhost:5173 ou utilisez le proxy Vite.'
        );
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;

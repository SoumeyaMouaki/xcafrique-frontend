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

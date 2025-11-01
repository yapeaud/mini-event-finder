import axios from 'axios';

// Configuration de l'URL de l'API
// En développement: utilise VITE_API_URL ou localhost:3001
// En production: utilise l'URL complète du backend Render
const getApiUrl = () => {
  // Si VITE_API_URL est défini, l'utiliser (priorité)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En développement, utiliser localhost
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:3001/api/events';
  }
  
  // En production, vous devrez définir VITE_API_URL dans Vercel
  // Exemple: https://votre-backend.onrender.com/api/events
  return '/api/events'; // Fallback (ne fonctionnera pas sans configuration)
};

const API_URL = getApiUrl();

// Instance axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Récupérer tous les événements
export const getAllEvents = async (searchLocation = '') => {
  try {
    const params = searchLocation ? { location: searchLocation } : {};
    const response = await api.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Erreur lors de la récupération des événements'
    );
  }
};

// Récupérer un événement par son ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Erreur lors de la récupération de l\'événement'
    );
  }
};

// Créer un nouvel événement
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/', eventData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      'Erreur lors de la création de l\'événement'
    );
  }
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
};

import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : '/api/events';

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


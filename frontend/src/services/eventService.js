import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const eventService = {
    
    // Récupérer tous les événements
    async getEvents() {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements');
        }
    },

    // Récupérer un événement par son ID
    async getEventById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'événement');
        }
    },

    // Créer un nouvel événement
    async createEvent(eventData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/events`, eventData);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'événement');
        }
    }
};
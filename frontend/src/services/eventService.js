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
    },

      // Récupérer les événements avec calcul de distance
  async getEventsWithDistance(userLat, userLon) {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events`);
            const events = response.data;

            // Ajouter la distance à chaque événement
            const eventsWithDistance = events.map(event => {
                if (event.locationCoords && userLat && userLon) {
                    const distance = geolocationService.calculateDistance(
                        userLat,
                        userLon,
                        event.locationCoords.latitude,
                        event.locationCoords.longitude
                    );
                    return { ...event, distance };
                }
                return event;
            });
            // Trier par distance
            return eventsWithDistance.sort((a, b) => {
                if (!a.distance) return 1;
                if (!b.distance) return -1;
                return a.distance - b.distance;
            });
        } catch (error) {
            throw new Error('Erreur lors de la récupération des événements avec distance');
        }
    },
    // Ajouter les coordonnées GPS à un événement
    async addEventWithCoords(eventData) {
        try {
            // Géocoder l'adresse pour obtenir les coordonnées
            const coords = await geolocationService.geocodeAddress(eventData.location);

            const eventWithCoords = {
                ...eventData,
                locationCoords: {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }
            };

            const response = await axios.post(`${API_BASE_URL}/api/events`, eventWithCoords);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'ajout de l\'événement avec coordonnées');
        }
    }

};
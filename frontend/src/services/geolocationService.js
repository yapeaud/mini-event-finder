// Service pour la géolocalisation et calcul des distances
export const geolocationService = {
    // Obtenir la position actuelle de l'utilisateur
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur'));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    let errorMessage = 'Erreur lors de la géolocalisation';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Permission de géolocalisation refusée';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Position indisponible';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Timeout de la géolocalisation';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );
        });
    },

    // Calculer la distance entre deux points en km (formule de Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance en km

        return Math.round(distance * 10) / 10; // Arrondir à 1 décimale
    },

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    },

    // Geocoding: convertir une adresse en coordonnées GPS
    async geocodeAddress(address) {
        try {
            // Utilisation de l'API OpenStreetMap Nominatim (gratuite)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );

            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon)
                };
            }

            throw new Error('Adresse non trouvée');
        } catch (error) {
            throw new Error('Erreur lors du géocodage de l\'adresse');
        }
    }
};
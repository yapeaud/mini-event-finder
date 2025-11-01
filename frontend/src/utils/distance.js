/**
 * Calcule la distance entre deux points géographiques en kilomètres
 * en utilisant la formule de Haversine
 * 
 * @param {number} lat1 - Latitude du premier point
 * @param {number} lon1 - Longitude du premier point
 * @param {number} lat2 - Latitude du deuxième point
 * @param {number} lon2 - Longitude du deuxième point
 * @returns {number} Distance en kilomètres
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return null;
  }

  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
};

/**
 * Convertit un angle en degrés en radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Obtient la position géographique de l'utilisateur
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error('Impossible d\'obtenir votre position: ' + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};



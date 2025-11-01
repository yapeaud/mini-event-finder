import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllEvents } from '../services/eventService';
import { getUserLocation, calculateDistance } from '../utils/distance';
import EventCard from './EventCard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Charger les événements
  useEffect(() => {
    loadEvents();
  }, [locationFilter]);

  // Filtrer les événements
  useEffect(() => {
    let filtered = [...events];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term)
      );
    }

    // Calculer les distances si la position de l'utilisateur est disponible
    if (userLocation) {
      filtered = filtered.map((event) => {
        if (event.locationCoords?.latitude && event.locationCoords?.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            event.locationCoords.latitude,
            event.locationCoords.longitude
          );
          return { ...event, distance };
        }
        return event;
      });

      // Trier par distance
      filtered.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, events, userLocation]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents(locationFilter);
      setEvents(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await getUserLocation();
      setUserLocation(location);
      toast.success('Position géolocalisée avec succès !');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLocationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-muted">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <button
            onClick={loadEvents}
            className="btn btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-dark mb-4">
          Liste des Événements
        </h1>

        {/* Barre de recherche et filtres */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 mb-3">
              {/* Recherche par texte */}
              <div className="col-md-6">
                <div className="position-relative">
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher par titre ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control ps-5"
                  />
                </div>
              </div>

              {/* Filtre par location */}
              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="Filtrer par lieu..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Bouton géolocalisation */}
            <div className="d-flex gap-2 align-items-center">
              {userLocation ? (
                <button
                  onClick={() => setUserLocation(null)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Annuler la géolocalisation
                </button>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="btn btn-success btn-sm"
                >
                  {locationLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Géolocalisation...
                    </>
                  ) : (
                    'Activer la géolocalisation'
                  )}
                </button>
              )}
              {userLocation && (
                <span className="text-success small">
                  ✓ Tri par distance activé
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-3">
          {filteredEvents.length === 0 ? (
            <p className="text-muted">Aucun événement trouvé</p>
          ) : (
            <p className="text-muted">
              {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé
              {filteredEvents.length !== events.length && ` sur ${events.length}`}
            </p>
          )}
        </div>
      </div>
      <div className="pt-4 border-top mb-4">
            <Link
              to="/events/new"
              className="btn btn-primary"
            >
              Créer un nouvel événement
            </Link>
          </div>

      {/* Liste des événements */}
      {filteredEvents.length > 0 ? (
        <div className="row g-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="col-md-6 col-lg-4">
              <EventCard
                event={event}
                distance={event.distance || null}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-0">
              Aucun événement ne correspond à votre recherche.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;

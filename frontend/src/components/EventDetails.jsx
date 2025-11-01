import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';
import { getEventById } from '../services/eventService';
import { getUserLocation, calculateDistance } from '../utils/distance';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDistance = async () => {
    if (!event?.locationCoords?.latitude || !event?.locationCoords?.longitude) {
      toast.warning('Les coordonnées de l\'événement ne sont pas disponibles');
      return;
    }

    try {
      setLocationLoading(true);
      const userLocation = await getUserLocation();
      const calculatedDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        event.locationCoords.latitude,
        event.locationCoords.longitude
      );
      setDistance(calculatedDistance);
      toast.success('Distance calculée avec succès !');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-muted">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center">
          <p className="mb-3">{error || 'Événement non trouvé'}</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const participationPercentage = ((event.currentParticipants || 0) / event.maxParticipants) * 100;

  return (
    <div className="container py-4">
      <Link
        to="/"
        className="d-inline-flex align-items-center text-decoration-none text-primary mb-4"
      >
        <ArrowLeft size={20} className="me-2" />
        <span>Retour à la liste</span>
      </Link>

      <div className="card shadow-lg">
        <div className="card-body p-4 p-md-5">
          <h1 className="display-4 fw-bold text-dark mb-4">{event.title}</h1>

          <p className="lead text-muted mb-5">
            {event.description}
          </p>

          <div className="mb-5">
            <div className="mb-4">
              <div className="d-flex align-items-start">
                <Calendar className="text-primary me-3 mt-1" size={24} />
                <div>
                  <h3 className="fw-semibold text-dark mb-1">Date et heure</h3>
                  <p className="text-muted mb-0">{formatDate(event.date)}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex align-items-start">
                <MapPin className="text-danger me-3 mt-1" size={24} />
                <div className="flex-grow-1">
                  <h3 className="fw-semibold text-dark mb-1">Lieu</h3>
                  <p className="text-muted mb-2">{event.location}</p>
                  {event.locationCoords?.latitude && event.locationCoords?.longitude && (
                    <div>
                      {distance !== null ? (
                        <span className="badge bg-primary fs-6">
                          À {distance} km de votre position
                        </span>
                      ) : (
                        <button
                          onClick={handleGetDistance}
                          disabled={locationLoading}
                          className="btn btn-link p-0 text-primary text-decoration-none"
                        >
                          {locationLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Calcul en cours...
                            </>
                          ) : (
                            'Calculer la distance'
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex align-items-start">
                <Users className="text-success me-3 mt-1" size={24} />
                <div className="flex-grow-1">
                  <h3 className="fw-semibold text-dark mb-1">Participants</h3>
                  <p className="text-muted mb-2">
                    {event.currentParticipants || 0} / {event.maxParticipants} participants
                  </p>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${participationPercentage}%` }}
                      aria-valuenow={participationPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;

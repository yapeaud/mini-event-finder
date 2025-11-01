import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, FileText, ArrowLeft } from 'lucide-react';
import { createEvent } from '../services/eventService';
import { getUserLocation } from '../utils/distance';
import { toast } from 'react-toastify';

const EventForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    maxParticipants: '',
    locationCoords: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await getUserLocation();
      setFormData((prev) => ({
        ...prev,
        locationCoords: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }));
      toast.success('Position géolocalisée avec succès !');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Le lieu est requis');
      return;
    }
    if (!formData.date) {
      toast.error('La date est requise');
      return;
    }
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) < 1) {
      toast.error('Le nombre de participants doit être supérieur à 0');
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        date: formData.date,
        maxParticipants: parseInt(formData.maxParticipants),
        locationCoords: formData.locationCoords || undefined,
      };

      await createEvent(eventData);
      toast.success('Événement créé avec succès !');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link
            to="/"
            className="d-inline-flex align-items-center text-decoration-none text-primary mb-4"
          >
            <ArrowLeft size={20} className="me-2" />
            <span>Retour à la liste</span>
          </Link>

          <div className="card shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h1 className="display-5 fw-bold text-dark mb-4">
                Créer un nouvel événement
              </h1>

              <form onSubmit={handleSubmit}>
                {/* Titre */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label d-flex align-items-center fw-semibold">
                    <FileText size={20} className="me-2 text-primary" />
                    Titre de l'événement
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Ex: Conférence sur le développement web"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label d-flex align-items-center fw-semibold">
                    <FileText size={20} className="me-2 text-primary" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="form-control"
                    placeholder="Décrivez votre événement..."
                  />
                </div>

                {/* Lieu */}
                <div className="mb-4">
                  <label htmlFor="location" className="form-label d-flex align-items-center fw-semibold">
                    <MapPin size={20} className="me-2 text-danger" />
                    Lieu
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Ex: Paris, France"
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className="btn btn-link p-0 text-primary text-decoration-none small"
                    >
                      {locationLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Géolocalisation...
                        </>
                      ) : (
                        'Utiliser ma position actuelle'
                      )}
                    </button>
                    {formData.locationCoords && (
                      <span className="ms-2 text-success small">✓ Position enregistrée</span>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label htmlFor="date" className="form-label d-flex align-items-center fw-semibold">
                    <Calendar size={20} className="me-2 text-info" />
                    Date et heure
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                {/* Nombre de participants */}
                <div className="mb-4">
                  <label htmlFor="maxParticipants" className="form-label d-flex align-items-center fw-semibold">
                    <Users size={20} className="me-2 text-success" />
                    Nombre maximum de participants
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-control"
                    placeholder="Ex: 50"
                  />
                </div>

                {/* Boutons */}
                <div className="d-flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-grow-1"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Création en cours...
                      </>
                    ) : (
                      'Créer l\'événement'
                    )}
                  </button>
                  <Link
                    to="/"
                    className="btn btn-outline-secondary"
                  >
                    Annuler
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;

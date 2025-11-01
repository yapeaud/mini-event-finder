import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, distance = null }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Link
      to={`/events/${event._id}`}
      className="card text-decoration-none shadow-sm border-0 h-100"
      style={{ transition: 'box-shadow 0.3s', overflow: 'hidden' }}
      onMouseOver={(e) => e.currentTarget.classList.add('shadow')}
      onMouseOut={(e) => e.currentTarget.classList.remove('shadow')}
    >
      <div className="card-body">
        <h3 className="card-title h5 fw-bold text-dark mb-3 text-truncate">
          {event.title}
        </h3>

        <p className="card-text text-muted mb-4 text-truncate">
          {event.description}
        </p>

        <div className="small text-secondary">
          <div className="d-flex align-items-center mb-2">
            <Calendar size={16} className="text-primary me-2" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="d-flex align-items-center mb-2 flex-wrap">
            <MapPin size={16} className="text-danger me-2" />
            <span>{event.location}</span>
            {distance !== null && (
              <span className="badge bg-primary ms-2">
                {distance} km
              </span>
            )}
          </div>

          <div className="d-flex align-items-center">
            <Users size={16} className="text-success me-2" />
            <span>
              {event.currentParticipants || 0} / {event.maxParticipants} participants
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top">
          <span className="text-primary fw-semibold small">
            Voir les détails →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
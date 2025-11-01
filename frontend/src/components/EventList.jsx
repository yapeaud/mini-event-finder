import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Loading from './Loading';
import{ eventService } from '../services/eventService';
import { EventCard } from './EventCard';


const EventList = ({ searchLocation, onEventSelect, refresh }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les événements depuis MongoDB
    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const eventsData = await eventService.getEvents();
            setEvents(eventsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [refresh]);

    // Filtrer les événements
    useEffect(() => {
        const filtered = events.filter(event =>
            event.location.toLowerCase().includes(searchLocation.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [events, searchLocation]);

    if (loading) return <Loading />;

    if (error) {
        return (
            <article className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="text-red-600" size={24} />
                <span className="text-red-700">{error}</span>
            </article>
        );
    }

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length === 0 ? (
                    <article className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchLocation ? 'Aucun événement trouvé pour cette localisation' : 'Aucun événement disponible'}
                        </p>
                    </article>
                ) : (
                    filteredEvents.map((event) => (
                        <EventCard
                            key={event._id} // MongoDB utilise _id par défaut
                            event={event}
                            onClick={onEventSelect}
                        />
                    ))
                )}
            </section>
        </>
    );
};

export default EventList;
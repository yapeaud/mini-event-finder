import { useState, useEffect } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import Loading from './Loading';
import { eventService } from '../services/eventService';
import { geolocationService } from '../services/geolocationService';
import { EventCard } from './EventCard';

const EventList = ({ searchLocation, onEventSelect, refresh }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);

    // Obtenir la position de l'utilisateur
    const getUserLocation = async () => {
        try {
            setLocationLoading(true);
            const position = await geolocationService.getCurrentPosition();
            setUserLocation(position);
            return position;
        } catch (error) {
            console.warn('Impossible d\'obtenir la position:', error.message);
            return null;
        } finally {
            setLocationLoading(false);
        }
    };

    // Charger les événements avec distance
    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);

            let eventsData;
            if (userLocation) {
                // Charger avec calcul de distance
                eventsData = await eventService.getEventsWithDistance(
                    userLocation.latitude,
                    userLocation.longitude
                );
            } else {
                // Charger sans distance
                const response = await eventService.getEvents();
                eventsData = response.data || response;
            }

            setEvents(eventsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Demander la géolocalisation au chargement
        getUserLocation();
    }, []);

    useEffect(() => {
        loadEvents();
    }, [refresh, userLocation]);

    // Filtrer les événements
    useEffect(() => {
        let filtered = events;

        if (searchLocation) {
            filtered = events.filter(event =>
                event.location.toLowerCase().includes(searchLocation.toLowerCase())
            );
        }

        setFilteredEvents(filtered);
    }, [events, searchLocation]);

    // Activer/désactiver la géolocalisation
    const toggleGeolocation = async () => {
        if (userLocation) {
            setUserLocation(null);
        } else {
            await getUserLocation();
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <main className="space-y-6">
                {/* Bouton de géolocalisation */}
                <section className="flex items-center justify-between">
                    <article className="flex items-center gap-2 text-sm text-gray-600">
                        {userLocation ? (
                            <>
                                <MapPin size={16} className="text-green-600" />
                                <span>Tri par distance activé</span>
                            </>
                        ) : (
                            <span>Tri par date</span>
                        )}
                    </article>

                    <button
                        onClick={toggleGeolocation}
                        disabled={locationLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${userLocation
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } disabled:opacity-50`}
                    >
                        <MapPin size={16} />
                        {locationLoading ? 'Chargement...' :
                            userLocation ? 'Désactiver la localisation' : 'Activer la localisation'}
                    </button>
                </section>

                {error && (
                    <article className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <AlertCircle className="text-red-600" size={24} />
                        <span className="text-red-700">{error}</span>
                    </article>
                )}

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
                                key={event._id}
                                event={event}
                                onClick={onEventSelect}
                            />
                        ))
                    )}
                </section>
            </main>
        </>
    );
};

export default EventList;
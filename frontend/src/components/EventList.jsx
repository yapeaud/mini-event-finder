import { useState, useEffect } from 'react';
import { AlertCircle, MapPin, SlidersHorizontal } from 'lucide-react';
import Loading from './Loading';
import { eventService } from '../services/eventService';
import { geolocationService } from '../services/geolocationService';
import { EventCard } from './EventCard';
import { filterEvents, sortEvents } from '../utils/filters';
import SearchBar from './SearchBar'; // Importez le composant SearchB


const EventList = ({ searchLocation, onEventSelect, refresh }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);

    // États pour les filtres et le tri
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        date: '',
        participants: ''
    });
    const [sortBy, setSortBy] = useState('date_asc');
    const [showFilters, setShowFilters] = useState(false);

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
                eventsData = await eventService.getEventsWithDistance(
                    userLocation.latitude,
                    userLocation.longitude
                );
            } else {
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

    // Appliquer les filtres et le tri
    useEffect(() => {
        let filtered = filterEvents(events, searchTerm, filters);
        filtered = sortEvents(filtered, sortBy);
        setFilteredEvents(filtered);
    }, [events, searchTerm, filters, sortBy]);

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        loadEvents();
    }, [refresh, userLocation]);

    // Gestionnaire pour la recherche
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Gestionnaire pour effacer la recherche
    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Compteur d'événements filtrés
    const eventsCount = filteredEvents.length;
    const totalEvents = events.length;

    if (loading) return <Loading />;

    return (
        <>
            <main className="space-y-6">
                {/* En-tête avec contrôles */}
                <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Compteur et géolocalisation */}
                    <article className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            {eventsCount === totalEvents ? (
                                `${totalEvents} événement${totalEvents > 1 ? 's' : ''}`
                            ) : (
                                `${eventsCount} sur ${totalEvents} événement${totalEvents > 1 ? 's' : ''}`
                            )}
                        </div>

                        <button
                            onClick={getUserLocation}
                            disabled={locationLoading}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${userLocation
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } disabled:opacity-50`}
                        >
                            <MapPin size={14} />
                            {locationLoading ? '...' : userLocation ? 'Localisé' : 'Me localiser'}
                        </button>
                    </article>

                    {/* Contrôles de tri */}
                    <article className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        >
                            <option value="date_asc">Date (plus proche)</option>
                            <option value="date_desc">Date (plus lointaine)</option>
                            <option value="name_asc">Nom (A-Z)</option>
                            <option value="name_desc">Nom (Z-A)</option>
                            {userLocation && <option value="distance_asc">Distance (proche)</option>}
                            <option value="participants_asc">Participants (croissant)</option>
                            <option value="participants_desc">Participants (décroissant)</option>
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${showFilters || filters.category || filters.date || filters.participants
                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <SlidersHorizontal size={16} />
                            Filtres
                        </button>
                    </article>
                </section>

                {/* Barre de recherche et filtres */}
                <SearchBar
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClear={handleClearSearch}
                    showFilters={showFilters}
                    onFiltersToggle={setShowFilters}
                    filters={filters}
                    onFiltersChange={setFilters}
                    placeholder="Rechercher par titre, description ou lieu..."
                />

                {error && (
                    <article className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="text-red-600" size={24} />
                        <span className="text-red-700">{error}</span>
                    </article>
                )}

                {/* Liste des événements */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.length === 0 ? (
                        <article className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <AlertCircle size={48} className="mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg mb-2">
                                Aucun événement trouvé
                            </p>
                            <p className="text-gray-400 text-sm">
                                {searchTerm || filters.category || filters.date || filters.participants
                                    ? 'Essayez de modifier vos critères de recherche'
                                    : 'Aucun événement disponible pour le moment'
                                }
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
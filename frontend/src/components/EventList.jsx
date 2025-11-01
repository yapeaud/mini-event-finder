import { useState, useEffect } from 'react';
import { MapPin, SlidersHorizontal } from 'lucide-react';
import Loading, { LoadingSkeleton } from './Loading';
import ErrorDisplay, { NetworkError, DataError, GeolocationError } from './ErrorDisplay';
import { eventService } from '../services/eventService';
import { geolocationService } from '../services/geolocationService';
import { EventCard } from './EventCard';
import { filterEvents, sortEvents } from '../utils/filters';
import SearchBar from './SearchBar';

const EventList = ({ searchLocation, onEventSelect, refresh }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    // États de chargement
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(false);
    const [filtersLoading, setFiltersLoading] = useState(false);

    // États d'erreur
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const [userLocation, setUserLocation] = useState(null);

    // États pour les filtres et le tri
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        date: '',
        participants: ''
    });
    const [sortBy, setSortBy] = useState('date_asc');
    const [showFilters, setShowFilters] = useState(false);

    // Obtenir la position de l'utilisateur avec gestion d'erreur
    const getUserLocation = async () => {
        try {
            setLocationLoading(true);
            setLocationError(null);
            const position = await geolocationService.getCurrentPosition();
            setUserLocation(position);
            return position;
        } catch (error) {
            console.warn('Impossible d\'obtenir la position:', error.message);
            setLocationError(error.message);
            return null;
        } finally {
            setLocationLoading(false);
        }
    };

    // Charger les événements avec gestion d'erreur complète
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
            console.error('Erreur lors du chargement des événements:', err);
            setError(err.message || 'Une erreur est survenue lors du chargement des événements');
        } finally {
            setLoading(false);
        }
    };

    // Appliquer les filtres et le tri avec état de chargement
    useEffect(() => {
        setFiltersLoading(true);

        // Simuler un délai pour les filtres complexes
        const timer = setTimeout(() => {
            let filtered = filterEvents(events, searchTerm, filters);
            filtered = sortEvents(filtered, sortBy);
            setFilteredEvents(filtered);
            setFiltersLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [events, searchTerm, filters, sortBy]);

    // Chargement initial
    useEffect(() => {
        getUserLocation();
    }, []);

    // Recharger les événements quand nécessaire
    useEffect(() => {
        loadEvents();
    }, [refresh, userLocation]);

    // Gestionnaires
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleRetryLoadEvents = () => {
        setError(null);
        loadEvents();
    };

    const handleRetryGeolocation = () => {
        setLocationError(null);
        getUserLocation();
    };

    // Compteurs
    const eventsCount = filteredEvents.length;
    const totalEvents = events.length;

    // État de chargement principal
    if (loading) {
        return (
            <section className="space-y-6">
                <article className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="flex gap-3">
                        <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                </article>
                <LoadingSkeleton count={6} />
            </section>
        );
    }

    return (
        <>
            <main className="space-y-6">
                {/* En-tête avec contrôles */}
                <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Compteur et géolocalisation */}
                    <article className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                            {loading ? (
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            ) : (
                                eventsCount === totalEvents ? (
                                    `${totalEvents} événement${totalEvents > 1 ? 's' : ''}`
                                ) : (
                                    `${eventsCount} sur ${totalEvents} événement${totalEvents > 1 ? 's' : ''}`
                                )
                            )}
                        </div>

                        <button
                            onClick={getUserLocation}
                            disabled={locationLoading}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${userLocation
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {locationLoading ? (
                                <Loading size="small" text="" type="dots" />
                            ) : (
                                <>
                                    <MapPin size={14} />
                                    {userLocation ? 'Localisé' : 'Me localiser'}
                                </>
                            )}
                        </button>
                    </article>

                    {/* Contrôles de tri */}
                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            disabled={filtersLoading}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={filtersLoading}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${showFilters || filters.category || filters.date || filters.participants
                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <SlidersHorizontal size={16} />
                            Filtres
                            {filtersLoading && (
                                <div className="w-2 h-2 border border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            )}
                        </button>
                    </div>
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

                {/* Affichage des erreurs */}
                {error && (
                    <NetworkError
                        error={error}
                        onRetry={handleRetryLoadEvents}
                    />
                )}

                {locationError && (
                    <GeolocationError
                        error={locationError}
                        onRetry={handleRetryGeolocation}
                    />
                )}

                {/* État de chargement des filtres */}
                {filtersLoading && (
                    <div className="flex justify-center py-4">
                        <Loading size="small" text="Application des filtres..." type="dots" />
                    </div>
                )}

                {/* Liste des événements */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.length === 0 && !loading && !error ? (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <MapPin size={48} className="mx-auto" />
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
                        </div>
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
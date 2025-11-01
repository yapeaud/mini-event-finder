import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { eventService } from '../services/eventService';

const EventDetail = ({ eventId, onClose }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (eventId) {
            loadEventDetails();
        }
    }, [eventId]);

    const loadEventDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const eventData = await eventService.getEventById(eventId);
            setEvent(eventData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!eventId) return null;

    return (
        <>
            <main className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <section className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <article className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {loading ? 'Chargement...' : event?.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-4">
                                <p>Chargement des détails...</p>
                            </div>
                        )}

                        {event && (
                            <>
                                <p className="text-gray-600 mb-6">{event.description}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-indigo-600" size={20} />
                                        <span className="text-lg">{event.location}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-indigo-600" size={20} />
                                        <span className="text-lg">{formatDate(event.date)}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Users className="text-indigo-600" size={20} />
                                        <div>
                                            <span className="text-lg font-medium">
                                                {event.currentParticipants}/{event.maxParticipants} participants
                                            </span>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full"
                                                    style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations supplémentaires depuis MongoDB */}
                                    {event.category && (
                                        <div className="flex items-center gap-3">
                                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                                {event.category}
                                            </span>
                                        </div>
                                    )}

                                    {event.createdAt && (
                                        <div className="text-sm text-gray-500 mt-4">
                                            Créé le {new Date(event.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </article>
                </section>
            </main>
        </>
    );
};

export default EventDetail;
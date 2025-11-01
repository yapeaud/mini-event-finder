import { useState } from 'react';
import { eventService } from '../services/eventService';

const EventForm = ({ show, onClose, onEventCreated, editingEvent }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        maxParticipants: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialiser le formulaire si on édite un événement
    useState(() => {
        if (editingEvent) {
            setFormData({
                title: editingEvent.title || '',
                description: editingEvent.description || '',
                location: editingEvent.location || '',
                date: editingEvent.date ? editingEvent.date.split('T')[0] : '',
                maxParticipants: editingEvent.maxParticipants || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                location: '',
                date: '',
                maxParticipants: ''
            });
        }
    }, [editingEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const eventData = {
                ...formData,
                maxParticipants: parseInt(formData.maxParticipants),
                currentParticipants: 0 // Initialiser à 0 pour les nouveaux événements
            };

            if (editingEvent) {
                // Mise à jour d'un événement existant
                await eventService.updateEvent(editingEvent._id, eventData);
            } else {
                // Création d'un nouvel événement
                await eventService.createEvent(eventData);
            }

            // Réinitialiser le formulaire
            setFormData({
                title: '',
                description: '',
                location: '',
                date: '',
                maxParticipants: ''
            });

            // Fermer le modal et notifier le parent
            onEventCreated();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingEvent ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Participants maximum *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.maxParticipants}
                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                                >
                                    {loading ? 'En cours...' : (editingEvent ? 'Modifier' : 'Créer')}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventForm;
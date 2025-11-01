import { MapPin, Calendar, Users } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import { getAvailabilityStatus } from '../utils/availabilityHelper';


export const EventCard = ({ event, onClick }) => {
    return (
        <>
            <main
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                onClick={() => onClick(event)}
            >
                <section className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                    <article className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={16} className="text-indigo-600" />
                            <span>{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} className="text-indigo-600" />
                            <span>{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <Users size={16} className="text-indigo-600" />
                            <span>
                                {event.currentParticipants}/{event.maxParticipants} participants
                            </span>
                        </div>

                        {/* Catégorie */}
                        {event.category && (
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                    {event.category}
                                </span>
                            </div>
                        )}

                        <div className={`text-sm font-medium ${event.currentParticipants >= event.maxParticipants
                                ? 'text-red-600'
                                : event.currentParticipants >= event.maxParticipants * 0.9
                                    ? 'text-orange-600'
                                    : 'text-green-600'
                            }`}>
                            {event.currentParticipants >= event.maxParticipants
                                ? 'Complet'
                                : getAvailabilityStatus(event.currentParticipants, event.maxParticipants)}
                        </div>
                    </article>
                </section>
            </main>
        </>
    )
}

import { useState } from 'react'
import Header from '../components/Header'
import EventForm from '../components/EventForm'
import EventList from '../components/EventList'
import EventDetail from '../components/EventDetail'
import SearchBar from '../components/SearchBar'

const EventPage = () => {
    const [searchLocation, setSearchLocation] = useState('');
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEventCreated = () => {
        setRefreshTrigger(prev => prev + 1); // Déclencher le rechargement de la liste
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEvent(null);
    };
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Header onCreateEvent={() => setShowForm(true)} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Section */}
                    <div className="mb-8">
                        <SearchBar
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            placeholder="Rechercher par localisation..."
                        />
                    </div>

                    {/* Event List */}
                    <EventList
                        searchLocation={searchLocation}
                        onEventSelect={(event) => setSelectedEventId(event._id)}
                        refresh={refreshTrigger}
                    />
                </main>

                {/* Modals */}
                <EventDetail
                    eventId={selectedEventId}
                    onClose={() => setSelectedEventId(null)}
                />

                <EventForm
                    show={showForm}
                    onClose={handleCloseForm}
                    onEventCreated={handleEventCreated}
                    editingEvent={editingEvent}
                />
            </div>

        </>
    )
}

export default EventPage

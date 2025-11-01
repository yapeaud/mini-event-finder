// Fonctions utilitaires pour le filtrage des événements
export const filterEvents = (events, searchTerm, filters) => {
    let filtered = [...events];

    // Filtre par recherche texte
    if (searchTerm) {
        filtered = filtered.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Filtre par catégorie
    if (filters.category) {
        filtered = filtered.filter(event =>
            event.category === filters.category
        );
    }

    // Filtre par date
    if (filters.date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);

            switch (filters.date) {
                case 'today':
                    return eventDate.toDateString() === today.toDateString();

                case 'tomorrow':
                    return eventDate.toDateString() === tomorrow.toDateString();

                case 'week':
                    return eventDate >= startOfWeek && eventDate <= endOfWeek;

                case 'weekend':
                    const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
                    return isWeekend && eventDate >= today;

                case 'month':
                    return eventDate >= startOfMonth && eventDate <= endOfMonth;

                case 'future':
                    return eventDate >= today;

                default:
                    return true;
            }
        });
    }

    // Filtre par disponibilité
    if (filters.participants) {
        filtered = filtered.filter(event => {
            switch (filters.participants) {
                case 'available':
                    return event.currentParticipants < event.maxParticipants;

                case 'almost_full':
                    const percentage = (event.currentParticipants / event.maxParticipants) * 100;
                    return percentage >= 80 && percentage < 100;

                case 'full':
                    return event.currentParticipants >= event.maxParticipants;

                default:
                    return true;
            }
        });
    }

    return filtered;
};

// Options de tri
export const sortEvents = (events, sortBy) => {
    const sorted = [...events];

    switch (sortBy) {
        case 'date_asc':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));

        case 'date_desc':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

        case 'participants_asc':
            return sorted.sort((a, b) => a.currentParticipants - b.currentParticipants);

        case 'participants_desc':
            return sorted.sort((a, b) => b.currentParticipants - a.currentParticipants);

        case 'distance_asc':
            return sorted.sort((a, b) => {
                if (!a.distance) return 1;
                if (!b.distance) return -1;
                return a.distance - b.distance;
            });

        case 'name_asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));

        case 'name_desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));

        default:
            return sorted;
    }
};
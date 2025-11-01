import eventModel from "../models/eventModel.js";

// Fonction pour créer un nouvel event
export const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, maxParticipants, locationCoords } = req.body;

        // Vérification minimale
        if (!title || !description || !location || !date || !maxParticipants) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        // Validation des types
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: "Le titre doit être une chaîne non vide." });
        }

        if (typeof description !== 'string' || description.trim().length === 0) {
            return res.status(400).json({ error: "La description doit être une chaîne non vide." });
        }

        if (typeof location !== 'string' || location.trim().length === 0) {
            return res.status(400).json({ error: "Le lieu doit être une chaîne non vide." });
        }

        if (isNaN(maxParticipants) || maxParticipants < 1) {
            return res.status(400).json({ error: "Le nombre maximal de participants doit être un nombre positif." });
        }

        // Validation de la date
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({ error: "La date fournie est invalide." });
        }

        const event = await eventModel.create({ 
            title: title.trim(), 
            description: description.trim(), 
            location: location.trim(), 
            date: eventDate, 
            maxParticipants: parseInt(maxParticipants),
            locationCoords: locationCoords || undefined,
            currentParticipants: 0
        });

        res.status(201).json(event);

    } catch (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message || 'Erreur serveur lors de la création de l\'événement' });
    }
};

// Fonction pour lister tous les événements
export const getAllEvents = async (req, res) => {
    try {
        const { location } = req.query;
        const filter = {};

        if (location && typeof location === 'string' && location.trim().length > 0) {
            // recherche insensible à la casse
            filter.location = { $regex: location.trim(), $options: "i" };
        }
        
        const events = await eventModel.find(filter).sort({ date: 1 });

        res.status(200).json(events);

    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ error: error.message || 'Erreur serveur lors de la récupération des événements' });
    }
};

// Fonction pour obtenir un événement par son ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validation de l'ID MongoDB
        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "ID d'événement invalide." });
        }

        const event = await eventModel.findById(id);

        if (!event) {
            return res.status(404).json({ error: "Événement introuvable." });
        }

        res.status(200).json(event);

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'événement:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "ID d'événement invalide." });
        }
        res.status(500).json({ error: error.message || 'Erreur serveur lors de la récupération de l\'événement' });
    }
};
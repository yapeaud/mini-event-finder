import eventModel from "../models/eventModel.js";

//Fontion pour créer un nouvel event
export const createEvent = async (req, res) => {
    try {
        const event = await eventModel.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour lister tous les événements
export const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour obtenir un événement par son ID
export const getEventById = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Événement introuvable" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: 1
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
});

const eventModel = mongoose.model("event", eventSchema);

export default eventModel;
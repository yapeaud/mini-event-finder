import express from "express";
import { createEvent, getAllEvents, getEventById } from "../controllers/eventController.js";

const EventRouter = express.Router();

EventRouter.post("/", createEvent);
EventRouter.get("/", getAllEvents);
EventRouter.get("/:id", getEventById);

export default EventRouter;
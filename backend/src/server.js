import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import eventRoutes from './routes/eventRoutes.route.js'

// App config
const app = express()
const PORT = process.env.PORT || 3001
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // ← AJOUT IMPORTANT

// Middleware pour gérer les erreurs de JSON mal formé
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Le corps de la requête est invalide.' });
    }
    next();
});

// API Endpoints
app.use('/api/events', eventRoutes)

app.get('/', (req, res) => {
    res.send('API est en cours d\'execution')
})

// Gestion des routes non trouvées ← AJOUT
app.use(/.*/, (req, res) => {
    res.status(404).json({ 
        error: 'Route non trouvée',
        message: `La route ${req.originalUrl} n'existe pas` 
    });
});

// Gestion centralisée des erreurs ← AJOUT
app.use((error, req, res, next) => {
    console.error('Erreur:', error);
    res.status(error.status || 500).json({
        error: error.message || 'Erreur interne du serveur'
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'execution sur le port http://localhost:${PORT}`)
    console.log(`📡 API disponible sur http://localhost:${PORT}/api/events`);
})
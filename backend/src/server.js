import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import eventRoutes from './routes/eventRoutes.route.js'

//App config "Configuration de l'application"
const app = express()
const PORT = process.env.PORT || 8000
connectDB()

//Middleware "Intermediaries"
app.use(cors())
app.use(express.json())

//Middleware pour gérer les erreurs de JSON mal formé
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Le corps de la requête est invalide.' });
    }
    next();
});

//API Endpoints
app.use('/api/events', eventRoutes)

app.get('/', (req, res) => {
    res.send('API est en cours d\'execution')
})

app.listen(PORT, () => {
    console.log(`Serveur en cours d'execution sur le port http://localhost:${PORT}`)
    console.log(`📡 API disponible sur http://localhost:${PORT}/api/events`);
})
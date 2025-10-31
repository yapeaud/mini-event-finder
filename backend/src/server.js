import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'

//App config "Configuration de l'application"
const app = express()
const PORT = process.env.PORT || 8000
connectDB()

//Middleware "Intermediaries"
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('API est en cours d\'execution')
})

app.listen(PORT, () => {
    console.log(`Serveur en cours d'execution sur le port http://localhost:${PORT}`)
})
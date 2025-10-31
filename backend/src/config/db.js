import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connecté: ${conn.connection.host}`);	
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB:", error);
        process.exit(1); // 1 signifie un échec
    }
};
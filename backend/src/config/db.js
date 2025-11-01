import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error("MONGO_URI n'est pas défini dans les variables d'environnement");
        }

        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);	
    } catch (error) {
        console.error("❌ Erreur lors de la connexion à MongoDB:", error.message);
        console.error("💡 Vérifiez votre variable d'environnement MONGO_URI");
        process.exit(1); // 1 signifie un échec
    }
};
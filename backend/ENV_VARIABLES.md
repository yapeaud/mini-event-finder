# Variables d'Environnement - Backend

Ce fichier liste toutes les variables d'environnement nécessaires pour le backend.

## Variables requises

### `MONGO_URI` (obligatoire)
Chaîne de connexion MongoDB Atlas.
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### `FRONTEND_URL` (obligatoire en production)
URL du frontend déployé sur Vercel.
```
FRONTEND_URL=https://votre-frontend.vercel.app
```

## Variables optionnelles

### `PORT` (optionnel)
Port sur lequel le serveur écoute. Render définit automatiquement cette variable.
```
PORT=3001
```

### `NODE_ENV` (optionnel)
Environnement d'exécution. Render définit automatiquement `production`.
```
NODE_ENV=production
```

## Configuration sur Render

1. Allez dans votre service web sur Render
2. Cliquez sur "Environment"
3. Ajoutez chaque variable avec sa valeur
4. Cliquez sur "Save Changes"
5. Render redéploiera automatiquement

## Configuration locale

Créez un fichier `.env` à la racine du dossier `backend` :

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**⚠️ Important** : Ne commitez JAMAIS le fichier `.env` dans Git !



# Application de Recherche d'Événements

Une application complète de recherche d'événements avec un back-end Node.js/Express et un front-end React.

## Fonctionnalités

### Back-end
- ✅ API REST avec 3 endpoints :
  - `POST /api/events` - Créer un événement
  - `GET /api/events` - Lister tous les événements (avec filtre de localisation)
  - `GET /api/events/:id` - Obtenir les détails d'un événement
- ✅ Stockage en mémoire (pas de base de données requise)
- ✅ Validation des données

### Front-end
- ✅ Affichage de la liste des événements
- ✅ Affichage des détails d'un événement
- ✅ Formulaire de création d'événement
- ✅ Design moderne et responsive

### Fonctionnalités Bonus
- ✅ Recherche et filtrage par lieu
- ✅ Calcul de la distance depuis la localisation de l'utilisateur
- ✅ États de chargement
- ✅ Gestion des erreurs

## Structure du Projet

```
eventJS/
├── server/
│   ├── index.js          # Serveur Express principal
│   └── routes/
│       └── events.js      # Routes API pour les événements
├── client/
│   └── src/
│       ├── App.js        # Composant principal
│       ├── components/
│       │   ├── EventList.js
│       │   ├── EventDetails.js
│       │   ├── EventForm.js
│       │   └── SearchBar.js
│       └── ...
└── package.json
```

## Installation

### Installation complète (recommandée)

```bash
npm run install-all
```

### Installation manuelle

1. Installer les dépendances du serveur :
```bash
npm install
```

2. Installer les dépendances du client :
```bash
cd client
npm install
cd ..
```

## Démarrage

### Option 1 : Démarrer les deux serveurs simultanément (recommandé)

```bash
npm run dev
```

Cette commande démarre :
- Le serveur back-end sur `http://localhost:8050`
- Le serveur React sur `http://localhost:50173`

### Option 2 : Démarrer séparément

**Terminal 1 - Back-end :**
```bash
npm run dev
```

**Terminal 2 - Front-end :**
```bash
npm run dev
```

## Utilisation

1. Ouvrez votre navigateur à `http://localhost:5173`
2. Explorez les événements existants
3. Utilisez la barre de recherche pour rechercher par titre, description ou lieu
4. Utilisez le filtre par lieu pour filtrer les événements
5. Cliquez sur un événement pour voir ses détails
6. Créez un nouvel événement avec le formulaire

## API Endpoints

### POST /api/events
Créer un nouvel événement

**Body:**
```json
{
  "titre": "Nom de l'événement",
  "description": "Description de l'événement",
  "lieu": "Ville",
  "date": "2024-12-31T18:00:00",
  "maxParticipants": 100
}
```

### GET /api/events
Lister tous les événements

**Query params (optionnel):**
- `lieu`: Filtrer par lieu (ex: `?lieu=Paris`)

### GET /api/events/:id
Obtenir les détails d'un événement

## Technologies Utilisées

- **Back-end**: Node.js, Express, CORS
- **Front-end**: React, Bootstrap
- **Utilitaires**: UUID pour les IDs uniques

## Notes

- Le calcul de distance utilise la géolocalisation du navigateur (demande d'autorisation requise)
- Les coordonnées des villes sont approximatives (Paris, Lyon, Marseille)
- Les données sont stockées en mémoire et seront perdues au redémarrage du serveur


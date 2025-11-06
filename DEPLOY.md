# Guide de Déploiement - Mini Event Finder

Ce guide vous explique comment déployer le frontend sur **Vercel** et le backend sur **Render**.

## 📋 Prérequis

1. Un compte **Vercel** (gratuit) : https://vercel.com
2. Un compte **Render** (gratuit) : https://render.com
3. Un compte **MongoDB Atlas** (gratuit) : https://www.mongodb.com/cloud/atlas
4. Un dépôt Git (GitHub, GitLab, ou Bitbucket)

---

## 🔧 Étape 1 : Préparer MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (choisissez le plan gratuit)
3. Créez un utilisateur de base de données :
   - Aller dans "Database Access" → "Add New Database User"
   - Notez le nom d'utilisateur et le mot de passe
4. Configurez le réseau :
   - Aller dans "Network Access" → "Add IP Address"
   - Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0) pour le déploiement
5. Obtenez votre chaîne de connexion :
   - Aller dans "Database" → "Connect" → "Connect your application"
   - Copiez la chaîne de connexion (elle ressemble à : `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)
   - Remplacez `<password>` par votre mot de passe utilisateur

---

## 🚀 Étape 2 : Déployer le Backend sur Render

### 2.1. Préparer le dépôt Git

Assurez-vous que votre code backend est sur GitHub/GitLab/Bitbucket.

### 2.2. Créer un nouveau service Web sur Render

1. Connectez-vous à [Render](https://render.com)
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre dépôt Git si ce n'est pas déjà fait
4. Sélectionnez le dépôt contenant votre backend

### 2.3. Configurer le service

- **Name** : `mini-event-finder-backend` (ou le nom de votre choix)
- **Environment** : `Node`
- **Build Command** : `npm install` (ou laissez vide, Render le détectera automatiquement)
- **Start Command** : `npm start`
- **Root Directory** : `backend` (si votre backend est dans un sous-dossier)

### 2.4. Configurer les variables d'environnement

Dans la section "Environment Variables", ajoutez :

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
PORT=10000
```

**⚠️ Important** :
- Remplacez `MONGO_URI` par votre vraie chaîne de connexion MongoDB
- Laissez `FRONTEND_URL` vide pour l'instant, vous le mettrez à jour après avoir déployé le frontend
- `PORT` est optionnel, Render définit automatiquement le port (utilisez `process.env.PORT`)

### 2.5. Déployer

1. Cliquez sur "Create Web Service"
2. Render va automatiquement :
   - Cloner votre dépôt
   - Exécuter `npm install`
   - Démarrer votre serveur avec `npm start`
3. Notez l'URL de votre backend (ex: `https://mini-event-finder-backend.onrender.com`)

---

## 🎨 Étape 3 : Déployer le Frontend sur Vercel

### 3.1. Préparer le dépôt Git

Assurez-vous que votre code frontend est sur GitHub/GitLab/Bitbucket.

### 3.2. Créer un nouveau projet sur Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur "Add New..." → "Project"
3. Importez votre dépôt Git

### 3.3. Configurer le projet

- **Framework Preset** : Vite (sera détecté automatiquement)
- **Root Directory** : `frontend` (si votre frontend est dans un sous-dossier)
- **Build Command** : `npm run build` (sera détecté automatiquement)
- **Output Directory** : `dist` (sera détecté automatiquement)
- **Install Command** : `npm install`

### 3.4. Configurer les variables d'environnement

Dans "Environment Variables", ajoutez :

```
VITE_API_URL=https://mini-event-finder-backend.onrender.com/api/events
```

**⚠️ Important** : Remplacez par l'URL de votre backend Render (obtenue à l'étape 2.5)

### 3.5. Déployer

1. Cliquez sur "Deploy"
2. Vercel va automatiquement :
   - Installer les dépendances
   - Builder votre application
   - Déployer sur un domaine `*.vercel.app`
3. Notez l'URL de votre frontend (ex: `https://mini-event-finder-app.vercel.app`)

---

## 🔄 Étape 4 : Mettre à jour les URLs

### 4.1. Mettre à jour le backend

1. Retournez sur Render → Votre service backend
2. Allez dans "Environment"
3. Mettez à jour `FRONTEND_URL` avec l'URL de votre frontend Vercel :
   ```
   FRONTEND_URL=https://mini-event-finder-app.vercel.app
   ```
4. Cliquez sur "Save Changes"
5. Render redéploiera automatiquement

### 4.2. Vérifier la configuration du frontend

1. Retournez sur Vercel → Votre projet
2. Vérifiez que `VITE_API_URL` est correctement configuré
3. Si vous avez modifié l'URL, redéployez le frontend

---

## ✅ Étape 5 : Vérification

1. Visitez votre frontend déployé sur Vercel
2. Testez les fonctionnalités :
   - Affichage de la liste des événements
   - Création d'un nouvel événement
   - Affichage des détails d'un événement
   - Recherche et filtrage

---

## 🔍 Dépannage

### Problème : Erreur CORS

**Solution** : Vérifiez que `FRONTEND_URL` dans Render correspond exactement à l'URL de votre frontend Vercel (avec https://).

### Problème : Erreur de connexion MongoDB

**Solution** :
- Vérifiez que `MONGO_URI` est correct dans Render
- Vérifiez que votre IP est autorisée dans MongoDB Atlas (ou utilisez 0.0.0.0/0)
- Vérifiez que le mot de passe dans la chaîne de connexion n'a pas de caractères spéciaux à encoder (ex: `@` → `%40`)

### Problème : Le frontend ne charge pas les données

**Solution** :
- Vérifiez que `VITE_API_URL` est correct dans Vercel
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que le backend est en ligne sur Render

### Problème : Le backend s'endort (plan gratuit Render)

**Solution** : Render met en veille les services gratuits après 15 minutes d'inactivité. Le premier démarrage peut prendre quelques secondes.

---

## 📝 Notes importantes

1. **Plan gratuit Render** : Les services gratuits s'endorment après 15 minutes d'inactivité. Le premier démarrage peut prendre 30-60 secondes.

2. **Variables d'environnement** : 
   - Ne commitez JAMAIS vos fichiers `.env` dans Git
   - Utilisez les variables d'environnement directement dans Vercel et Render

3. **URLs** :
   - Render : `https://votre-app.onrender.com`
   - Vercel : `https://votre-app.vercel.app` (ou domaine personnalisé)

4. **MongoDB Atlas** :
   - Le plan gratuit est suffisant pour commencer
   - Vous pouvez créer plusieurs bases de données

---

## 🎉 Félicitations !

Votre application est maintenant déployée et accessible publiquement !

Frontend : https://votre-app.vercel.app  
Backend : https://votre-backend.onrender.com



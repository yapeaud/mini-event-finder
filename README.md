# 🎉 mini-event-finder  
Une application web permettant de rechercher, consulter et gérer des événements à proximité.

---

## 📝 Description  
**mini-event-finder** est une application composée d’un **backend Node.js/Express** et d’un **frontend React + Vite**.  
Elle permet à l’utilisateur de :
- Consulter la liste des événements disponibles  
- Filtrer les événements par lieu  
- Voir les détails d’un événement sélectionné  

---

## 🚀 Installation  

### ⚙️ Prérequis  
- Node.js (version 18 ou supérieure)  
- npm ou yarn  
- Git  
- (optionnel) une base de données compatible (MySQL, PostgreSQL, SQLite, etc.)

### 📦 Étapes d’installation  
1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/yapeaud/mini-event-finder.git
   cd mini-event-finder
   ```

2. **Installer les dépendances du backend**
   ```bash
   cd backend
   npm install
   ```

3. **Installer les dépendances du frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configurer les variables d’environnement**
   Voir la section suivante.

---

## 🔑 Variables d’environnement  

### Backend – `.env`
```env
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/mini_event_finder
JWT_SECRET=ton_secret_jwt
```

### Frontend – `.env`
```env
VITE_API_URL=http://localhost:3001/api
```

---

## ▶️ Exécution du projet  

### 🧩 Lancer le backend
```bash
cd backend
npm run dev
```
Le serveur démarre sur `http://localhost:3001`.

### 💻 Lancer le frontend
```bash
cd frontend
npm run dev
```
L’interface sera accessible sur `http://localhost:5173`.

### ⚙️ Exécution simultanée (optionnel)
Tu peux utiliser [concurrently](https://www.npmjs.com/package/concurrently) pour démarrer les deux serveurs :
```bash
npm install -g concurrently
concurrently "npm run dev --prefix backend" "npm run dev --prefix frontend"
```

---

## 📚 Documentation de l’API  

### Base URL
```
http://localhost:3001/api
```

### Endpoints principaux  

#### 🔹 Récupérer tous les événements
```
GET /api/events
```
**Réponse exemple**
```json
[
  {
    "id": 1,
    "title": "Salon de la Tech",
    "description": "Rencontrez les innovateurs du numérique",
    "location": "Abidjan",
    "date": "2025-11-05T18:00:00Z"
  }
]
```

#### 🔹 Récupérer un événement par ID
```
GET /api/events/:id
```

#### 🔹 Ajouter un événement
```
POST /api/events
```
**Body JSON**
```json
{
  "title": "Conférence IA",
  "description": "Découverte des outils d'intelligence artificielle",
  "location": "Yamoussoukro",
  "date": "2025-12-10T09:00:00Z"
}
```

#### 🔹 Mettre à jour un événement
```
PUT /api/events/:id
```

#### 🔹 Supprimer un événement
```
DELETE /api/events/:id
```

#### 🔹 Authentification (si implémentée)
- `POST /api/auth/register`
- `POST /api/auth/login`

**Header requis pour routes sécurisées**
```
Authorization: Bearer <token>
```

---

## 🧠 Défis rencontrés et solutions  

### 1. Gestion du CORS entre backend et frontend  
**Problème :** les requêtes API étaient bloquées par le navigateur.  
**Solution :** ajout du middleware `cors()` dans Express et configuration de `Access-Control-Allow-Origin`.

### 2. Variables d’environnement manquantes en production  
**Problème :** l’URL du backend n’était pas détectée par le frontend.  
**Solution :** utilisation d’une variable explicite `VITE_API_URL` dans le fichier `.env`.

### 3. Formatage des dates et fuseaux horaires  
**Problème :** affichage incorrect des dates (décalage).  
**Solution :** stockage en UTC côté backend et formatage côté frontend avec `date-fns`.

### 4. Exécution simultanée des serveurs  
**Problème :** besoin de démarrer deux serveurs manuellement.  
**Solution :** utilisation du package `concurrently` pour exécuter les deux avec une seule commande.

### 5. Gestion des erreurs API  
**Problème :** erreurs peu claires lors des requêtes.  
**Solution :** création d’un middleware global d’erreurs avec des messages standardisés.

---

## 🤖 Outils d’IA utilisés  

| Outil IA | Utilisation principale |
|-----------|-----------------------|
| **GitHub Copilot** | Génération de snippets pour Express, gestion d’erreurs et logique de filtrage |
| **ChatGPT (GPT-5)** | Rédaction de la documentation, structuration du README et optimisation du code |
| **SonarLint** | Analyse automatique de la qualité du code et détection de mauvaises pratiques |
| **AI UI Assistant** | Génération de palettes de couleurs et suggestions de design pour le frontend |

Grâce à ces outils, le développement a été accéléré, le code standardisé et la documentation simplifiée.

---

## 📈 Améliorations prévues  
- Gestion complète des utilisateurs (authentification, profils)  
- Système de création/modification/suppression d’événements pour les utilisateurs connectés  
- Filtrage avancé (par date, catégorie, lieu)  
- Version mobile (PWA)  
- Déploiement sur Vercel/Render avec CI/CD  

---

## 📅 Version  
**v1.0 — 01/11/2025**

---

👨‍💻 Développé par **Beda Eric Abed-nego Yapo**

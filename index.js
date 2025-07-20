// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./lib/passport');
const connectDB = require('./lib/db');
const ProtectRoute = require('./middleware/auth-middleware');

const authRouter = require('./routers/auth');
const foodsRouter = require('./routers/foods');
const mealsRouter = require('./routers/meals');
const profilRouter = require('./routers/profil');

const app = express();
const PORT = process.env.PORT || 3000;

// Dans index.js
const passport = require('passport');
require('./lib/passport')(); // Initialisation Passport
app.use(passport.initialize());


// Connexion à la base de données
connectDB().catch(err => {
  console.error('❌ Échec de connexion à la base de données:', err);
  process.exit(1);
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/foods', foodsRouter);
app.use('/meals', ProtectRoute, mealsRouter);
app.use('/profil', ProtectRoute, profilRouter);

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API NutriTrack');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

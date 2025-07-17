require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./lib/db');
const ProtectRoute = require('./middleware/auth-middleware');

const authRouter = require('./routers/auth');
const foodsRouter = require('./routers/foods');
const mealsRouter = require('./routers/meals');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectDB().catch(err => {
  console.error('❌ Échec de connexion à la base de données:', err);
  process.exit(1);
});

// Middlewares
app.use(cors({
  origin: 'https://front-my-calories.vercel.app', // Remplace par l’URL exacte de ton frontend Vercel
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/foods', foodsRouter);
app.use('/meals', ProtectRoute, mealsRouter);

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API MyCalories');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

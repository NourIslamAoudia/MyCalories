require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./lib/db'); // Importez simplement le fichier pour lancer la connexion
const ProtectRoute = require('./middleware/auth-middleware');

const authRouter = require('./routers/auth');
const foodsRouter = require('./routers/foods');
const mealsRouter = require('./routers/meals');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
// Autoriser UNIQUEMENT le frontend déployé sur Vercel
app.use(cors({
  origin: 'https://front-my-calories.vercel.app',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/foods',foodsRouter);
app.use('/meals', ProtectRoute, mealsRouter);

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API MyCalories');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
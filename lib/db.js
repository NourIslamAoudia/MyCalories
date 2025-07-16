const mongoose = require('mongoose');
require('dotenv').config();

// Connexion directe sans exporter de fonction
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Quitte le processus si la connexion échoue
});

// Exportez mongoose si nécessaire pour les modèles
module.exports = mongoose;
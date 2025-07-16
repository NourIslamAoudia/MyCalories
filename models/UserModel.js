const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true// Enlève les espaces inutiles
  },
  password: {
    type: String,
    required: true,
    select: false // Cache le password dans les requêtes
  }
});

const User = mongoose.model("User", userSchema);// Création du modèle User sous le nom "User"
module.exports = User;// Export du modèle pour l'utiliser dans d'autres fichiers
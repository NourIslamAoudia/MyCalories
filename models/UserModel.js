// models/userModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username requis'],
    unique: true,
    trim: true,
    minlength: [3, 'Minimum 3 caractères'],
    maxlength: [30, 'Maximum 30 caractères']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Requis seulement si pas d'authentification Google
    },
    minlength: [8, 'Minimum 8 caractères'],
    select: false // Ne pas retourner le password par défaut
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Permet plusieurs documents sans googleId
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} n'est pas un email valide!`
    }
  },
  avatar: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    min: [0, 'Taille doit être positive'],
    default: 170
  },
  weight: {
    type: Number,
    min: [0, 'Poids doit être positif'],
    default: 70
  },
  age: {
    type: Number,
    min: [0, 'Âge doit être positif'],
    default: 25
  },
  sex: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Sexe doit être "male", "female" ou "other"'
    },
    default: 'male'
  },
  caloriesGoal: {
    type: Number,
    default: 2000,
    min: [0, 'Objectif calorique doit être positif']
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt
  versionKey: '__v',
  toJSON: { virtuals: true }, // Pour inclure les virtuals dans les réponses JSON
  toObject: { virtuals: true }
});

// Methode pour valider avant appel manuel si besoin
userSchema.methods.validateSyncFields = function() {
  const err = this.validateSync();
  if (err) throw err;
};

/**
 * Calcul des besoins caloriques journaliers (BMR + TDEE).
 * @param {number} activityFactor - Facteur d'activité (1.2–1.9)
 * @returns {{ bmr: number, maintenance: number, lose: number, gain: number }}
 * @throws {Error} Si données invalides
 */
userSchema.methods.calculateCalories = function(activityFactor = 1) {
  // on vérifie avant tout que le document est valide
  this.validateSyncFields();

  const { weight, height, age, sex } = this;
  if (typeof activityFactor !== 'number' || activityFactor < 1.2 || activityFactor > 1.9) {
    throw new Error('activityFactor doit être un nombre entre 1.2 et 1.9');
  }

  // Calcul du BMR selon Mifflin–St Jeor (plus précis cliniquement) :contentReference[oaicite:6]{index=6}
  let base = 10 * weight + 6.25 * height - 5 * age;
  const bmr = Math.round(base + (sex === 'male' ? 5 : -161));

  const maintenance = Math.round(bmr * activityFactor);
  const lose = maintenance - 500;
  const gain = maintenance + 500;

  return { bmr, maintenance, lose, gain };
};

const User = mongoose.model('User', userSchema);
module.exports = User;

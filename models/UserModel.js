const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // Enlève les espaces inutiles
  },
  password: {
    type: String,
    required: true,
    select: false // Cache le password dans les requêtes
  },
  height: {
    type: Number,
    required: false,
    min: 0,
    default: 170 // en cm
  },
  weight: {
    type: Number,
    required: false,
    min: 0,
    default: 70 // en kg
  },
  age: {
    type: Number,
    required: false,
    min: 0,
    default: 25
  },
  sex: {
    type: String,
    required: false,
    enum: ['male', 'female'],
    default: 'male'
  }
});

/**
 * Calculates daily caloric needs based on the Mifflin-St Jeor equation:
 *  - BMR (Basal Metabolic Rate)
 *  - Maintenance = BMR * activityFactor
 *  - Weight loss = Maintenance - 500 kcal
 *  - Weight gain = Maintenance + 500 kcal
 * @param {number} activityFactor - Factor for activity level (e.g., 1.2 sedentary, 1.375 light, 1.55 moderate)
 * @returns {{ bmr: number, maintenance: number, lose: number, gain: number }}
 */
userSchema.methods.calculateCalories = function(activityFactor = 1.2) {
  // Mifflin-St Jeor equation
  // Male: BMR = 10*weight + 6.25*height - 5*age + 5
  // Female: BMR = 10*weight + 6.25*height - 5*age - 161
  const { weight, height, age, sex } = this;
  let bmr;
  if (sex === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const maintenance = Math.round(bmr * activityFactor);
  const lose = maintenance - 500;
  const gain = maintenance + 500;

  return {
    bmr: Math.round(bmr),
    maintenance,
    lose,
    gain
  };
};

const User = mongoose.model('User', userSchema);
module.exports = User;
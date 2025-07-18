//models/MealModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
    maxlength: [100, 'Meal name must be under 100 characters']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  items: [
    {
      food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: [true, 'Food reference is required']
      },
      amount: { // in grams
        type: Number,
        required: [true, 'Food amount is required'],
        min: [0, 'Amount must be positive']
      }
    }
  ],
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  proteinCalories: {
    type: Number,
    required: true,
    min: 0
  },
  carbCalories: {
    type: Number,
    required: true,
    min: 0
  },
  fatCalories: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Calculates total calories and macro calories from all items.
 * Assumes `items.food` is populated with Food documents.
 */
mealSchema.methods.calculateTotalCaloriesFromItems = function () {
  if (!this.items || this.items.length === 0) return;

  let totalCalories = 0;
  let totalProteinCalories = 0;
  let totalCarbCalories = 0;
  let totalFatCalories = 0;

  this.items.forEach(item => {
    const food = item.food;
    const grams = item.amount;
    const factor = grams / 100;

    totalCalories        += food.caloriesPer100g     * factor;
    totalProteinCalories += food.proteinPer100g * 4  * factor;
    totalCarbCalories    += food.carbsPer100g   * 4  * factor;
    totalFatCalories     += food.fatPer100g     * 9  * factor;
  });

  this.calories        = Math.round(totalCalories);
  this.proteinCalories = Math.round(totalProteinCalories);
  this.carbCalories    = Math.round(totalCarbCalories);
  this.fatCalories     = Math.round(totalFatCalories);
};

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;


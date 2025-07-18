// controllers/mealController.js
const Meal = require('../models/MealModel');

/**
 * Create a new meal
 * POST /meals
 * body: { name: String, date?: Date }
 */
exports.createMeal = async (req, res, next) => {
  try {
    const userId = req.user.id; // assume auth middleware
    const { name, date } = req.body;
    
    const meal = new Meal({
      name,
      user: userId,
      date: date || new Date(),
      items: [],
      calories: 0,
      proteinCalories: 0,
      carbCalories: 0,
      fatCalories: 0
    });
    
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a meal by ID
 * GET /meals/:mealId
 */
exports.getMealById = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const meal = await Meal.findById(mealId).populate('items.food');
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    res.json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a meal
 * PUT /meals/:mealId
 * body: { name?: String, date?: Date }
 */
exports.updateMeal = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const { name, date } = req.body;
    
    const meal = await Meal.findById(mealId).populate('items.food');
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    if (name) meal.name = name;
    if (date) meal.date = date;
    
    await meal.save();
    res.json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a meal
 * DELETE /meals/:mealId
 */
exports.deleteMeal = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const meal = await Meal.findById(mealId);
    
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    await Meal.findByIdAndDelete(mealId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/**
 * Add a food item to a meal
 * POST /meals/:mealId/items
 * body: { food: ObjectId, amount: Number }
 */
exports.addFoodToMeal = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const { food, amount } = req.body;
    
    const meal = await Meal.findById(mealId).populate('items.food');
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    meal.items.push({ food, amount });
    // populate newly added item
    await meal.populate('items.food');
    // recalc calories
    meal.calculateTotalCaloriesFromItems();
    await meal.save();

    res.status(201).json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a food item in a meal
 * PUT /meals/:mealId/items/:itemId
 * body: { amount: Number }
 */
exports.updateFoodInMeal = async (req, res, next) => {
  try {
    const { mealId, itemId } = req.params;
    const { amount } = req.body;
    
    const meal = await Meal.findById(mealId).populate('items.food');
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    const item = meal.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.amount = amount;
    // recalc calories
    meal.calculateTotalCaloriesFromItems();
    await meal.save();

    res.json(meal);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a food item from a meal
 * DELETE /meals/:mealId/items/:itemId
 */
exports.deleteFoodFromMeal = async (req, res, next) => {
  try {
    const { mealId, itemId } = req.params;
    
    // Correction: utiliser _id au lieu de *id
    const meal = await Meal.findByIdAndUpdate(
      mealId,
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate('items.food');

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Retourner le meal mis à jour
    res.json({
      success: true,
      meal: meal,
      message: 'Food item deleted successfully'
    });
    
  } catch (err) {
    console.error('Error deleting food item:', err);
    res.status(500).json({ 
      message: 'Failed to delete food item', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

/**
 * Get meals per day for a user
 * GET /meals/per-day?date=YYYY-MM-DD
 */
exports.getMealsPerDay = async (req, res, next) => {
  try {
    const userId = req.user.id; // assume auth middleware
    const { date } = req.query;
    
    const day = date ? new Date(date) : new Date();
    const start = new Date(day.setHours(0,0,0,0));
    const end = new Date(day.setHours(23,59,59,999));
    
    console.log(`Fetching meals for user ${userId} from ${start} to ${end}`);
    
    const meals = await Meal.find({
      user: userId,
      date: { $gte: start, $lte: end }
    }).populate('items.food');

    res.json(meals);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all food items in a meal
 * GET /meals/:mealId/items
 */
exports.getFoodsInMeal = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const meal = await Meal.findById(mealId).populate('items.food');
    
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    res.json(meal.items); // returns array of { _id, food, amount }
  } catch (err) {
    next(err);
  }
};
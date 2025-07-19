// controllers/mealController.js
const Meal = require('../models/MealModel');

/* ------------------------------------------
   CREATE
-------------------------------------------*/

/**
 * Create a new meal
 * POST /meals
 * body: { name: String, date?: Date }
 */
exports.createMeal = async (req, res, next) => {
  try {
    const userId = req.user.id; // from auth middleware
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


/* ------------------------------------------
   READ
-------------------------------------------*/

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
 * Get all food items in a meal
 * GET /meals/:mealId/items
 */
exports.getFoodsInMeal = async (req, res, next) => {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId).populate('items.food');
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.json(meal.items); // array of { _id, food, amount }
  } catch (err) {
    next(err);
  }
};

/**
 * Get meals per day for a user
 * GET /meals/per-day?date=YYYY-MM-DD
 */
exports.getMealsPerDay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const day = date ? new Date(date) : new Date();
    const start = new Date(day.setHours(0, 0, 0, 0));
    const end = new Date(day.setHours(23, 59, 59, 999));

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


/* ------------------------------------------
   UPDATE
-------------------------------------------*/

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
 * Update a food item in a meal
 * PUT /meals/:mealId/items/:itemId
 * body: { amount: Number }
 */
exports.updateFoodInMeal = async (req, res, next) => {
  try {
    const { mealId, itemId } = req.params;
    const { amount } = req.body;

    const meal = await Meal.findById(mealId).populate('items.food');
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const item = meal.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.amount = amount;
    meal.calculateTotalCaloriesFromItems();
    await meal.save();

    res.json(meal);
  } catch (err) {
    next(err);
  }
};


/* ------------------------------------------
   DELETE
-------------------------------------------*/

/**
 * Delete a meal
 * DELETE /meals/:mealId
 */
exports.deleteMeal = async (req, res, next) => {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId).populate('items.food');
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
 * Delete a food item from a meal
 * DELETE /meals/:mealId/items/:itemId
 */

exports.deleteFoodFromMeal = async (req, res, next) => {
    try {
        const { mealId, itemId } = req.params;

        // Find meal and populate food data
        const meal = await Meal.findById(mealId).populate('items.food');
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        console.log(`Deleting item ${itemId} from meal ${mealId}`);
        
        // Check if the item exists before trying to remove it
        const itemExists = meal.items.id(itemId);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found' });
        }

        console.log(`Found item: ${itemExists}`);

        // Remove the item using pull
        meal.items.pull(itemId);

        // Check if meal is empty after removal
        if (meal.items.length === 0) {
            await Meal.findByIdAndDelete(mealId);
            return res.status(204).end(); // No Content
        }

        // Recalculate totals after removing the item (synchronous method)
        meal.calculateTotalCaloriesFromItems();
        
        // Save the updated meal
        await meal.save();

        // Populate the meal again for the response
        await meal.populate('items.food');

        res.status(200).json({
            success: true,
            meal,
            message: 'Food item deleted successfully',
        });

    } catch (err) {
        console.error('Error deleting food item:', err);
        res.status(500).json({
            message: 'Failed to delete food item',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

/* ------------------------------------------
   ITEM MANAGEMENT
-------------------------------------------*/

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
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    meal.items.push({ food, amount });
    await meal.populate('items.food'); // Ensure the new item is populated
    meal.calculateTotalCaloriesFromItems();
    await meal.save();

    res.status(201).json(meal);
  } catch (err) {
    next(err);
  }
};

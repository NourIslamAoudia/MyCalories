const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

// Add a food item to a meal
router.post('/:mealId/items', mealController.addFoodToMeal);
// Update a food item
router.put('/:mealId/items/:itemId',mealController.updateFoodInMeal);
// Delete a food item
router.delete('/:mealId/items/:itemId',mealController.deleteFoodFromMeal);
// Get meals per day
router.get('/per-day',mealController.getMealsPerDay);
// Get all food for a meal
router.get('/:mealId/items',mealController.getFoodsInMeal);

module.exports = router;
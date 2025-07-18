// routes/mealRoutes.js
const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

// IMPORTANT: Routes spécifiques AVANT les routes avec paramètres dynamiques

// Get meals per day - DOIT être avant /:mealId
router.get('/per-day', mealController.getMealsPerDay);

// Create a new meal
router.post('/', mealController.createMeal);

// Get a meal by ID
router.get('/:mealId', mealController.getMealById);

// Update a meal
router.put('/:mealId', mealController.updateMeal);

// Delete a meal
router.delete('/:mealId', mealController.deleteMeal);

// Add a food item to a meal
router.post('/:mealId/items', mealController.addFoodToMeal);

// Get all food items in a meal
router.get('/:mealId/items', mealController.getFoodsInMeal);

// Update a food item in a meal
router.put('/:mealId/items/:itemId', mealController.updateFoodInMeal);

// Delete a food item from a meal
router.delete('/:mealId/items/:itemId', mealController.deleteFoodFromMeal);

module.exports = router;
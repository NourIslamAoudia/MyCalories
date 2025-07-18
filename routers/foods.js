// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Route pour récupérer tous les aliments (sans pagination)
router.get('/allfood', foodController.getAllFoods);

// Search foods (avec query parameter)
router.get('/', foodController.searchFoods);

// Get a food by ID
router.get('/:foodId', foodController.getFoodById);

// Create a new food
router.post('/', foodController.createFood);

// Update a food
router.put('/:foodId', foodController.updateFood);

// Delete a food
router.delete('/:foodId', foodController.deleteFood);

module.exports = router;
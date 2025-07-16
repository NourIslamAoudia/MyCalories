// Exemple dans routers/auth.js
const express = require('express');
const router = express.Router();
const foodController= require('../controllers/foodController');

// Route pour l'inscription
router.get('/getall', foodController.getAllFoods);

module.exports = router;
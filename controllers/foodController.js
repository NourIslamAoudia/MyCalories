// controllers/foodController.js
const Food = require('../models/FoodModel');

/**
 * Search for foods
 * GET /foods?search=query
 */
const searchFoods = async (req, res) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      // Return all foods if no search query
      const foods = await Food.find({}).limit(50).lean();
      return res.status(200).json(foods);
    }
    
    // Search by name (case-insensitive)
    const foods = await Food.find({
      name: { $regex: search, $options: 'i' }
    }).limit(50).lean();
    
    res.status(200).json(foods);
  } catch (err) {
    console.error('Erreur lors de la recherche des aliments:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche des aliments' });
  }
};

/**
 * Get all foods without pagination
 * GET /foods/allfood
 */
const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({}).lean(); // Récupère tous les documents sans pagination
    
    res.status(200).json(foods); // Retourne directement le tableau d'aliments
  } catch (err) {
    console.error('Erreur lors de la récupération des aliments:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des aliments' });
  }
};

/**
 * Get a food by ID
 * GET /foods/:foodId
 */
const getFoodById = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId).lean();
    
    if (!food) {
      return res.status(404).json({ message: 'Aliment non trouvé' });
    }
    
    res.status(200).json(food);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'aliment:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'aliment' });
  }
};

/**
 * Create a new food
 * POST /foods
 * body: { name, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g, category, photoUrl? }
 */
const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    console.error('Erreur lors de la création de l\'aliment:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Un aliment avec ce nom existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'aliment' });
  }
};

/**
 * Update a food
 * PUT /foods/:foodId
 * body: { name?, caloriesPer100g?, proteinPer100g?, carbsPer100g?, fatPer100g?, category?, photoUrl? }
 */
const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findByIdAndUpdate(foodId, req.body, { new: true, runValidators: true });
    
    if (!food) {
      return res.status(404).json({ message: 'Aliment non trouvé' });
    }
    
    res.status(200).json(food);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'aliment:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Un aliment avec ce nom existe déjà' });
    }
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'aliment' });
  }
};

/**
 * Delete a food
 * DELETE /foods/:foodId
 */
const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findByIdAndDelete(foodId);
    
    if (!food) {
      return res.status(404).json({ message: 'Aliment non trouvé' });
    }
    
    res.status(204).end();
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'aliment:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'aliment' });
  }
};

module.exports = {
  getAllFoods,
  searchFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
};
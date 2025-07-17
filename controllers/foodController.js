const Food = require('../models/FoodModel');

// Récupérer tous les aliments sans pagination
const getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find({}).lean(); // Récupère tous les documents sans pagination

        res.status(200).json(foods); // Retourne directement le tableau d'aliments
    } catch (err) {
        console.error('Erreur lors de la récupération des aliments:', err);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des aliments' });
    }
};

module.exports = { getAllFoods };
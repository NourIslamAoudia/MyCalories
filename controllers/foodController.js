const Food = require('../models/FoodModel');

// Récupérer tous les aliments depuis la base de données
const getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find().lean(); // lean() retourne des objets JS simples, plus léger
        res.status(200).json(foods);
    } catch (err) {
        console.error('Erreur lors de la récupération des aliments:', err.message);
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération des aliments'
        });
    }
};

module.exports = getAllFoods;

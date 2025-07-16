const Food = require('../models/FoodModel');

// Affiche tous les aliments existants dans la base de données
async function getAllFoods(req, res) {
    try {
        const foods = await Food.find({});
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des aliments', error });
    }
}

module.exports = {
    getAllFoods
};
const Food = require('../models/FoodModel');

// Récupérer tous les aliments ou un aliment spécifique par son nom
const getFood = async (req, res) => {
    try {
        const { name } = req.query;

        // Si un nom est fourni, on filtre par ce nom
        const foods = name
            ? await Food.find({ name: new RegExp(name, 'i') }).lean() // recherche insensible à la casse
            : await Food.find().lean(); // tous les aliments

        res.status(200).json(foods);
    } catch (err) {
        console.error('Erreur lors de la récupération des aliments:', err.message);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des aliments' });
    }
};

module.exports = { getFood };

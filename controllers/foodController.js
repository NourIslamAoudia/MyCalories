const Food = require('../models/FoodModel');

// Récupérer tous les aliments avec toutes les infos, avec pagination
const getAllFoods = async (req, res) => {
    try {
        const { page = 1, limit = 80 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const foods = await Food
            .find({})
            .skip(skip)
            .limit(parseInt(limit))
            .lean(); // lean() pour améliorer les performances

        const total = await Food.countDocuments();

        res.status(200).json({
            data: foods,
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des aliments:', err);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des aliments' });
    }
};

module.exports = { getAllFoods };

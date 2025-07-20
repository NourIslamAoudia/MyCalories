// models/FoodModel.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    caloriesPer100g: {
        type: Number,
        required: true,
        min: 0
    },
    proteinPer100g: {
        type: Number,
        required: true,
        min: 0
    },
    carbsPer100g: {
        type: Number,
        required: true,
        min: 0
    },
    fatPer100g: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    photoUrl: {
        type: String,
        required: true,
        default: 'https://medias-wordpress-offload.storage.googleapis.com/kirn.fr/2020/06/13151113/escalope-poulet-nature-1.jpg'
    }
}, {
    timestamps: true
});

const Food = mongoose.model("Food",FoodSchema);// Création du modèle User sous le nom "User"
module.exports = Food;// Export du modèle pour l'utiliser dans d'autres fichiers

const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

// GET profil (affiche les infos utilisateur)
router.get('/', profilController.getProfil);

// PUT profil (mise à jour des infos)
router.put('/', profilController.updateProfil); // Correction de la faute de frappe

// GET profil/bmr (calcule les calories)
router.get('/bmr', profilController.getCalories);

//GET profil/caloriesGoal (affiche l'objectif calorique)
router.get('caloriesGolal', profilController.getCaloriesGoal);

// PUT profil/caloriesGoal (met à jour l'objectif calorique)
router.put('caloriesGolal', profilController.updateCaloriesGoal);

module.exports = router;
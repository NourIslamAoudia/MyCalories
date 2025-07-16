// Exemple dans routers/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription
router.post('/register', authController.register);
// Route pour la connexion
router.post('/login', authController.login);

router.get('/getall', authController.getAllUsers); // Optionnel, pour récupérer tous les utilisateurs

module.exports = router;
// Exemple dans routers/auth.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();


// Route pour l'inscription
router.post('/register', authController.register);
// Route pour la connexion
router.post('/login', authController.login);

router.get('/getall', authController.getAllUsers); // Optionnel, pour récupérer tous les utilisateurs

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  authController.googleLoginCallback
);


module.exports = router;
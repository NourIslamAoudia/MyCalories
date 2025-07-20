// Exemple dans routers/auth.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();


// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/getall', authController.getAllUsers);

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login?error=google_auth_failed'
  }),
  (req, res) => {
    // Redirection avec token JWT
    res.redirect(`https://front-my-calories.vercel.app/?token=${req.user.token}`);
  }
);

module.exports = router;
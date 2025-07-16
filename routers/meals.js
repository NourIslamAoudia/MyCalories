// Exemple dans routers/auth.js
const express = require('express');
const router = express.Router();

// Route pour l'inscription
router.get('/', (req, res) => {
  res.send("User Meals - it's a protected route ");// format JSON
});

module.exports = router;
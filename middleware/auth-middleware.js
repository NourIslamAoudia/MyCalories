const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Middleware de protection des routes privées
const ProtectRoute = async (req, res, next) => {
  try {
    // 1. Récupération du token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token manquant ou mal formé.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Vérification et décodage du token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Vérification de l'existence de l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable. Token invalide.'
      });
    }

    // 4. Attacher les données utilisateur à la requête
    req.user = {
      id: user._id,
      username: user.username,
    };

    // 5. Poursuivre vers le middleware ou contrôleur suivant
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);

    // Gestion spécifique des erreurs JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré.'
      });
    }

    // Autres erreurs internes
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification.'
    });
  }
};

module.exports = ProtectRoute;

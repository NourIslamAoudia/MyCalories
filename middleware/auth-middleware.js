const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // Ajustez le chemin selon votre structure

// Middleware pour protéger les routes
const ProtectRoute = async (req, res, next) => {
    try {
        // 1. Extraction du token depuis le header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Accès refusé. Token manquant.'
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Vérification et décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// decode and verify the token

        // 3. Vérification que l'utilisateur existe toujours
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé. Token invalide.'
            });
        }

        // 4. Ajout des informations utilisateur à la requête
        req.user = {
            id: user._id,
            username: user.username,
            
        };

        // 5. Passer au middleware suivant
        next();

    } catch (error) {
        console.error('Erreur d\'authentification:', error);

        // Gestion des erreurs JWT spécifiques
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide.'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré.'
            });
        }

        // Autres erreurs
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'authentification.'
        });
    }
};

module.exports = ProtectRoute;

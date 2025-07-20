//controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generateToken } = require('../lib/utils');

const authController = {
  /* ----------------------------------------
     Connexion (Login)
     POST /auth/login
  -----------------------------------------*/
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Vérification des champs requis
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username et password sont requis'
        });
      }

      // Recherche de l'utilisateur
      const user = await User.findOne({ username }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants incorrects'
        });
      }

      // Comparaison du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants incorrects'
        });
      }

      // Génération du token JWT
      const token = generateToken(user._id);

      // Réponse JSON avec le token
      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          id: user._id,
          username: user.username
        }
      });

      // ➕ Alternative cookie :
      /*
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000
      }).status(200).json({
        success: true,
        message: 'Connexion réussie',
        user: {
          id: user._id,
          username: user.username
        }
      });
      */

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  },

  /* ----------------------------------------
     Inscription (Register)
     POST /auth/register
  -----------------------------------------*/
  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username et password sont requis'
        });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Cet utilisateur existe déjà'
        });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        username,
        password: hashedPassword
      });

      await newUser.save();

      const token = generateToken(newUser._id);

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        token,
        user: {
          id: newUser._id,
          username: newUser.username
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  },

  /* ----------------------------------------
     Déconnexion (si cookie utilisé)
     GET /auth/logout
  -----------------------------------------*/
  logout: async (req, res) => {
    try {
      res.clearCookie('token'); // Supprime le cookie JWT
      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  },

  /* ----------------------------------------
     Récupération de tous les utilisateurs
     GET /users
     (⚠️ à protéger via un middleware admin)
  -----------------------------------------*/
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password').lean();
      res.status(200).json(users);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err.message);
      res.status(500).json({
        message: 'Erreur serveur lors de la récupération des utilisateurs'
      });
    }
  }
};

async function googleLoginCallback(req, res) {
  try {
    const user = req.user;
    
    // Set token in cookie or send in response
    res.cookie('token', user.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    res.redirect('/profile');
  } catch (error) {
    console.error('Google login callback error:', error);
    res.redirect('/auth/login?error=google_auth_failed');
  }
}
module.exports = {
  ...authController,
  googleLoginCallback,
};

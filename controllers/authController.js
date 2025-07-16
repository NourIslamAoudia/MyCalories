const bcrypt = require('bcryptjs');
const User = require('../models/UserModel'); // Correction de la casse du nom de fichier
const { generateToken } = require('../lib/utils'); // Ajustez le chemin selon votre structure

const authController = { // on a deux fonctions principales: login et register
    // Fonction de connexion
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validation des données d'entrée
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username et password sont requis'
                });
            }

            // Recherche de l'utilisateur avec le mot de passe inclus
            const user = await User.findOne({ username }).select('+password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            // Vérification du mot de passe
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            // Génération du token JWT
            const token = generateToken(user._id);

            // Option 1: Retourner le token dans la réponse JSON
            res.status(200).json({
                success: true,
                message: 'Connexion réussie',
                token,
                user: {
                    id: user._id,
                    username: user.username
                }
            });

        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    },

    // Fonction d'inscription (bonus)
    register: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validation des données d'entrée
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username et password sont requis'
                });
            }

            // Vérification si l'utilisateur existe déjà
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Cet utilisateur existe déjà'
                });
            }

            // Hachage du mot de passe
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Création du nouvel utilisateur
            const newUser = new User({
                username,
                password: hashedPassword
            });

            await newUser.save();

            // Génération du token JWT
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

    // Option 2: Envoyer le token dans un cookie (décommentez si nécessaire)
            /*
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // HTTPS en production
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 heures
            });

            res.status(200).json({
                success: true,
                message: 'Connexion réussie',
                user: {
                    id: user._id,
                    username: user.username
                }
            });
    // Fonction de déconnexion (pour les cookies)
    logout: async (req, res) => {
        try {
            // Suppression du cookie si utilisé
            res.clearCookie('token');
            
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
    }
    */
   getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password').lean(); // Exclure le mot de passe
            res.status(200).json(users);
        } catch (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err.message);
            res.status(500).json({
                message: 'Erreur serveur lors de la récupération des utilisateurs'
            });
        }
    }
};

module.exports = authController;
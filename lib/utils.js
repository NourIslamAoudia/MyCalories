const jwt = require('jsonwebtoken');

//genrate token
function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
    //token contient l'ID de l'utilisateur et est signé avec le secret JWT
module.exports = { generateToken };

//si enveut envoyer dans un cookeis en doit ajouter dans les parametres d'enter de la fonctiom 'res' : res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }); 

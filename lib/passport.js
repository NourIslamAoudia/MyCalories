const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel');
const { generateToken } = require('../lib/utils');

module.exports = function configurePassport() {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Extract Google profile info
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const username = email.split('@')[0];
        const avatar = profile.photos[0].value;

        // Find or create user
        let user = await User.findOne({ 
          $or: [
            { googleId },
            { email }
          ]
        });

        if (!user) {
          // New user - create with Google
          user = await User.create({
            googleId,
            username,
            email,
            avatar,
            isVerified: true
          });
        } else {
          // Existing user - update Google info if needed
          if (!user.googleId) {
            user.googleId = googleId;
          }
          if (!user.avatar) {
            user.avatar = avatar;
          }
          await user.save();
        }

        // Always generate a new token, whether new or existing user
        const token = generateToken(user._id);
        user.token = token;

        return done(null, user);
      } catch (err) {
        console.error('Google authentication error:', err);
        return done(err, null);
      }
    }
  )
  );
};
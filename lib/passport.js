const passport = require('passport');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const User = require('../models/UserModel');
const { generateToken } = require('../lib/utils');

module.exports = function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async ( profile, done) => {
        try {
          // Extract Google profile info
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const username = email; // or profile.displayName
          const avatar = profile.photos[0].value;

          // Find or create user
          let user = await User.findOne({ googleId });
          if (!user) {
            user = await User.create({
              googleId,
              username,
              email,
              avatar
            });
          }

          // Attach token for response
          const token = generateToken(user._id);
          user.jwtToken = token;

          return done(null, user);// Return user with token
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

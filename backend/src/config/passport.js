const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel"); // Import your user model

/* Passport Middleware */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client secret
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/auth/google/callback",
    },
    async function (token, tokenSecret, profile, done) {
      try {
        console.log(profile);

        // Try to find existing user with this googleId
        let user = await User.findOne({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            googleId: profile.id,
            name:
              profile.displayName ||
              `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
            avatarUrl:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
            password: Math.random().toString(36).slice(-8), // Random password for Google users
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    }
  )
);

/* Facebook Strategy */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "name", "picture.type(large)"],
      enableProof: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log("Facebook profile:", profile);

        // Try to find existing user with this facebookId
        let user = await User.findOne({
          where: { facebookId: profile.id },
        });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            facebookId: profile.id,
            name:
              profile.displayName ||
              `${profile.name.givenName} ${profile.name.familyName}`,
            email: `facebook_${profile.id}@questify.temp`, // Generate temp email since Facebook doesn't provide it
            avatarUrl:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
            password: Math.random().toString(36).slice(-8), // Random password for Facebook users
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Facebook auth error:", err);
        return done(err, null);
      }
    }
  )
);

/* How to store the user information in the session */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/* How to retrieve the user from the session */
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* Exporting Passport Configuration */
module.exports = passport;

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

        if (user) {
          // User exists with this googleId, return the user
          return done(null, user);
        }

        // If no user found with googleId, check if user exists with this email
        user = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        if (user) {
          // User exists with this email but no googleId, link Google account
          await user.update({
            googleId: profile.id,
            isEmailVerified: true, // Mark as verified since authenticated via Google
            avatarUrl:
              user.avatarUrl ||
              (profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null),
          });
          return done(null, user);
        }

        // No user exists with this email or googleId, create new user
        user = await User.create({
          googleId: profile.id,
          name:
            profile.displayName ||
            `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value,
          isEmailVerified: true, // Mark as verified since authenticated via Google
          avatarUrl:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
          password: Math.random().toString(36).slice(-8), // Random password for Google users
        });

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

        if (user) {
          // User exists with this facebookId, return the user
          return done(null, user);
        }

        // Since Facebook no longer provides email for most apps,
        // we'll use a fallback email and rely on Facebook ID for identification
        const email = `facebook_${profile.id}@questify.temp`;

        // Check if a user already exists with this fallback email pattern
        user = await User.findOne({
          where: { email: email },
        });

        if (user) {
          // User exists with fallback email, link Facebook account if not already linked
          if (!user.facebookId) {
            await user.update({
              facebookId: profile.id,
              isEmailVerified: true, // Mark as verified since authenticated via Facebook
              avatarUrl:
                user.avatarUrl ||
                (profile.photos && profile.photos[0]
                  ? profile.photos[0].value
                  : null),
            });
          }
          return done(null, user);
        }

        // No user exists, create new user with fallback email
        const email_final =
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : `facebook_${profile.id}@questify.temp`; // Fallback email if Facebook doesn't provide one

        user = await User.create({
          facebookId: profile.id,
          name:
            profile.displayName ||
            `${profile.name.givenName} ${profile.name.familyName}`,
          email: email_final,
          isEmailVerified: true, // Mark as verified since authenticated via Facebook
          avatarUrl:
            profile.photos && profile.photos[0]
              ? profile.photos[0].value
              : null,
          password: Math.random().toString(36).slice(-8), // Random password for Facebook users
        });

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

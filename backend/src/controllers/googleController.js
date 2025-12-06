const router = require("express").Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/* Route to start OAuth2 authentication */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/* Callback route for OAuth2 authentication */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5174"
      }/login?error=auth_failed`,
  }),
  function (req, res) {
    try {
      // Successful authentication - generate JWT token
      const token = generateToken(req.user.id);

      // Redirect to frontend with token in URL (will be handled by frontend)
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";
      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatarUrl: req.user.avatarUrl, // Fix property name
            googleId: req.user.googleId,
            isEmailVerified: req.user.isEmailVerified,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
          })
        )}`
      );
    } catch (error) {
      console.error("Google auth callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
);

/* EXPORTS */
module.exports = router;

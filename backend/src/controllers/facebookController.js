const router = require("express").Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/* Route to start Facebook OAuth2 authentication */
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile"],
  })
);

/* Callback route for Facebook OAuth2 authentication */
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/login?error=auth_failed`,
  }),
  function (req, res) {
    try {
      // Successful authentication - generate JWT token
      const token = generateToken(req.user.id);

      // Redirect to frontend with token in URL (will be handled by frontend)
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar_url: req.user.avatarUrl,
            facebookId: req.user.facebookId,
            createdAt: req.user.createdAt,
          })
        )}`
      );
    } catch (error) {
      console.error("Facebook auth callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
);

/* EXPORTS */
module.exports = router;

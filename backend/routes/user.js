const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const userController = require('../controllers/users.js');

// Signup
router.post("/signup", wrapAsync(userController.signupPost));

// Login with custom JSON callback to avoid HTML redirects on failure
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info ? info.message : "Invalid username or password" });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return userController.loginPost(req, res);
        });
    })(req, res, next);
});

// Logout
router.get("/logout", userController.logout);

// Check current user status (session validation)
router.get("/current-user", userController.getCurrentUser);

module.exports = router;
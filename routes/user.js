const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const { isLoggedIn, savedRedirectURL } = require('../middleware.js');
const userController = require('../controllers/users.js');

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signupPost))

router.route("/login")
.get(userController.renderLoginForm)
.post(
    savedRedirectURL,
    passport.authenticate("local", //passport autheniticate is used as route middleware to authenticate requests.
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.loginPost); //From the users controller
        

router.get("/logout", userController.logout);

module.exports = router;
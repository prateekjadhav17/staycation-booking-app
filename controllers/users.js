const User = require('../models/users');


module.exports.renderSignupForm = (req, res) => {
    res.render('./users/signup.ejs')
}

module.exports.signupPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", `Welcome to Wanderlust ${req.user.username}!`);
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.loginPost = async (req, res) => {
            req.flash("success", `Welcome back ${req.user.username}!`);
            let redirectURL = res.locals.redirectURL || "/listings";
            res.redirect(redirectURL);
        }

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfuly Logged Out");
        res.redirect("/login");
    });
}
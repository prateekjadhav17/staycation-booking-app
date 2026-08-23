const User = require('../models/users');

module.exports.signupPost = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            res.status(201).json({ 
                message: `Welcome to Wanderlust ${req.user.username}!`, 
                user: { _id: req.user._id, username: req.user.username, email: req.user.email } 
            });
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.loginPost = async (req, res) => {
    res.json({ 
        message: `Welcome back ${req.user.username}!`, 
        user: { _id: req.user._id, username: req.user.username, email: req.user.email } 
    });
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.json({ message: "Successfully Logged Out" });
    });
};

module.exports.getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
    } else {
        res.json({ user: null });
    }
};
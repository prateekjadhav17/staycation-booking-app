if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

const { isLoggedIn } = require('./middleware.js');
const reviewRouter = require('./routes/reviews.js');
const listingRouter = require("./routes/listing.js");
const userRouter = require('./routes/user.js');

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err));

// CORS Configuration to allow requests from the React frontend (running on port 5173 by default)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", (e) => {
    console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, // Avoid creating session for unauthenticated requests
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents Cross-Site Scripting (XSS)
        sameSite: "lax", // Necessary for cross-origin cookie sharing on localhost
        secure: false, // Set to true only in production with HTTPS
    },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 handler for unmatched API routes
app.all('/*splat', (req, res, next) => {
    next(new ExpressError(404, "API endpoint not found!"));
});

// JSON Error handler Middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    if (!statusCode) statusCode = 500;
    if (!message) message = "Something went wrong";
    res.status(statusCode).json({ error: message });
});

app.listen(8080, () => {
    console.log("app is listening on port 8080");
});
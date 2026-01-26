if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

const { isLoggedIn } = require('./middleware.js');
const reviewRouter = require('./routes/reviews.js');
const listingRouter = require("./routes/listing.js");
const userRouter = require('./routes/user.js');


const dbUrl = process.env.ATLASDB_URL;

/**
 * @type {import('mongoose').Model}
 */


async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))
app.engine('ejs', ejsmate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", (e) => {
    console.log("SESSION STORE ERROR", e);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //To prevent Cross Scripting Attacks
    },
}

// app.get("/", (req, res) => {
//     res.send("Root ")
// });


app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    // console.log(res.locals.success);
    res.locals.error = req.flash('error');
    // console.log(res.locals.error);
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// random page requested
app.all('/*splat', (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})


// Error handler Middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    if (!statusCode) statusCode = 500;
    if (!message) message = "Something went wrong";
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", { message });
})



app.listen(8080, () => {
    console.log("app is listening on", 8080);
})
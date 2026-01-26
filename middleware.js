const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl; //Request original URL
        req.flash("error", "You must be signed in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        next(new ExpressError(400, error.details[0].message))
    } else {
        next();
    }
}


module.exports.savedRedirectURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let existingListing = await Listing.findById(id);
    if (res.locals.user && !existingListing.owner.equals(res.locals.user._id)) {
        req.flash("error", "You are not authorized to update this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (res.locals.user && !review.author.equals(res.locals.user._id)) {
        req.flash("error", "You are not authorized to update this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be signed in!" });
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        next(new ExpressError(400, error.details[0].message));
    } else {
        next();
    }
};

module.exports.savedRedirectURL = (req, res, next) => {
    // Left as a placeholder, redirect history is handled by React client
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let existingListing = await Listing.findById(id);
    if (!existingListing) {
        return res.status(404).json({ error: "Listing you requested for doesn't exist!" });
    }
    if (!req.user || !existingListing.owner.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not authorized to modify this listing!" });
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ error: "Review doesn't exist!" });
    }
    if (!req.user || !review.author.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not authorized to delete this review!" });
    }
    next();
};
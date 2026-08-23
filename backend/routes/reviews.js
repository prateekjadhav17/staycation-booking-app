const express = require("express");
const router = express.Router({ mergeParams: true }); //Read about express options @Ecpress js.com express router
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema, listingSchema } = require('../schema');
const { isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewController = require("../controllers/reviews");

const validateReviewSchema = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        next(new ExpressError(400, error.details[0].message))
    } else {
        next();
    }
}
// Review Routes
// Post Review Route
router.post("/",
    isLoggedIn,
    validateReviewSchema,
    wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
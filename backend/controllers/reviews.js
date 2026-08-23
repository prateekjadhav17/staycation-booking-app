const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        
        // Populate the author info so the client can display it immediately
        await newReview.populate("author");
        
        res.status(201).json({ message: "Review Added", review: newReview });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        let deleted = await Review.findByIdAndDelete(reviewId);
        res.json({ message: "Review Deleted", reviewId, deleted });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
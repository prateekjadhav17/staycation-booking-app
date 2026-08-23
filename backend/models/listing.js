const mongoose = require('mongoose');
const defaultImg = "https://images.unsplash.com/photo-1762957044542-583a86b753a3?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const Review = require('./review.js');
const { listingSchema } = require('../schema.js');

const ListingSchema = mongoose.Schema({
    title: {
        type: String,
        requires: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: defaultImg,
            // This set function ensures empty strings revert to the default image
            set: (v) => v === "" ? defaultImg : v,
        }
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
})

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model('Listing', ListingSchema);


module.exports = Listing;

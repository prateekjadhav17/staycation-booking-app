const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require('../cloudConfig');

const upload = multer({ storage });

// Listings Root Routes
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// Listing ID-specific Routes
router.route("/:id")
    .get(wrapAsync(listingController.showEach))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListingsPut)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListings)
    );

module.exports = router;

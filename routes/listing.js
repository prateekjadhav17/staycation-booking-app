const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner } = require('../middleware.js');
const { validateListing } = require('../middleware.js');

const listingController = require("../controllers/listing.js");
const multer = require('multer')
const { cloudinary, storage } = require('../cloudConfig')

const upload = multer({ storage });



// Home Route and create route

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new",
    isLoggedIn,
    wrapAsync(listingController.renderNew));

// Update route:
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListingGet)
);

// Router /:id 
router.route("/:id")
    .put(   // Update PUT
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListingsPut))
    .get(   // Show each Listing route
        wrapAsync(listingController.showEach)
    )
    .delete(    // Delete Route
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListings)
    );

module.exports = router;


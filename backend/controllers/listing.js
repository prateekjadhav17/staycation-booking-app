const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let alllistings = await Listing.find({});
    res.json(alllistings);
};

module.exports.renderNew = async (req, res) => {
    // Just a placeholder for authentication status if accessed
    res.json({ authenticated: true });
};

module.exports.showEach = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    if (!listing) {
        return res.status(404).json({ error: "Listing you requested for doesn't exist!" });
    }
    res.json({ listing, mapToken: process.env.MAP_TOKEN });
};

module.exports.createListing = async (req, res) => {
    try {
        let geometry = { type: "Point", coordinates: [77.209, 28.613] }; // Default coordinates (Delhi)
        
        if (mapToken && req.body.listing && req.body.listing.location) {
            let response = await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            }).send();
            
            if (response && response.body && response.body.features && response.body.features.length > 0) {
                geometry = response.body.features[0].geometry;
            }
        }

        let url = req.file ? req.file.path : "";
        let filename = req.file ? req.file.filename : "";

        let { listing } = req.body;
        const newListing = new Listing({
            title: listing.title,
            description: listing.description,
            image: {
                filename: filename,
                url: url,
            },
            price: listing.price,
            country: listing.country,
            location: listing.location,
            geometry: geometry
        });
        
        newListing.owner = req.user._id;
        await newListing.save();
        res.status(201).json({ message: "New Listing Created", listing: newListing });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.updateListingGet = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing you requested for doesn't exist!" });
    }
    res.json(listing);
};

module.exports.updateListingsPut = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (req.file !== undefined) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        res.json({ message: "Listing Updated", listing });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing Deleted", deleted });
};
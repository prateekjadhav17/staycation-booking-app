const Listing = require("../models/listing");
const flash = require('connect-flash')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    let alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
}

module.exports.renderNew = async (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}


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
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res,) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();
    console.log(response.body.features[0].geometry); //Console Log Flag

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "\n", filename);

    let { listing } = req.body;
    console.log(listing);
    const newListing = await new Listing({
        title: listing.title,
        description: listing.description,
        image: {
            filename: filename,
            url: url,
        },
        price: listing.price,
        country: listing.country,
        location: listing.location,
        geometry: response.body.features[0].geometry
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings")
}


module.exports.updateListingGet = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_100,w_250/");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


module.exports.updateListingsPut = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file !== undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings")
}
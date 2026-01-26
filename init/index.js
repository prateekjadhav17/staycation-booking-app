const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config({ path: "../.env" });

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const FindAndUpdate = async () => {
  try {
    let listingsToUpdate = await Listing.find({ geometry: { $exists: false } });
    console.log(`Found ${listingsToUpdate.length} listings to be updated`)

    for (let listing of listingsToUpdate) {
      try {
        let response = await geocodingClient.forwardGeocode({
          query: listing.location,
          limit: 1
        }).send();

        let geometry = response.body.features[0].geometry;
        await Listing.findByIdAndUpdate(listing._id, { geometry: geometry });
        console.log(`Updated listing ${listing.title}`)
      }
      catch (err) {
        console.log(`Error updating listing ${listing.title}`)
      }
    }
    console.log("Migration complete!");
  }
  catch (err) {
    console.log(err)
  }
  finally {
    await mongoose.connection.close()
      .then(() => console.log("Disconnected from MongoDB"))
      .catch(err => console.log(err));
  }
}

main()
  .then(() => {
    console.log("connected to db");
    return FindAndUpdate();
  })
  .catch(err => console.log(err));


// const initdb = async () => {
//   await Listing.deleteMany({});
//   initData.data.forEach(listing => {
//     listing.owner = "6948ed4eb2d40b2df8076431¸";
//   });
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized")
// }

// initdb();
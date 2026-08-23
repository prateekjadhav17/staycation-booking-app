mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
    center: coordinates, // center the map on this longitude and latitude
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 30 }).setHTML(
            `<h3>${listing_title}</h3><p>Exact location will be provided post booking!</p>`
        )
    )
    .addTo(map);



// map.addControl(new mapboxgl.NavigationControl());

// map.on('style.load', () => {
//     map.setFog({}); // Set the default atmosphere style
// });

// Initial Leaflet javascript - get map and center on Princeton
var corner1 = L.latLng(40.3520, -74.647),
corner2 = L.latLng(40.34, -74.664),
bounds = L.latLngBounds(corner1, corner2);

var mymap = L.map('mapid', {maxBounds: bounds, minZoom: 15, maxZoom: 19}).setView([40.3474, -74.6581], 17);

/* We're currently getting our tiles (the actual map rendering) from
Mapbox. If this app ever gets big, we really should change providers
or start paying somebody */
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYWNodW50IiwiYSI6ImNqdGF4Ym5odzBmbTE0M2w4ZGpyamhsbWEifQ.2wopZqSc9U4D3jIaWcQnIg',
}).addTo(mymap);



//Mark the current location (from Leaflet tutorial)
function onLocationFound(e) {
    console.log("Location worked");
    var radius = e.accuracy/2;
    console.log("Radius: " + radius);
    // Only print circle if pretty sure in the location panned to
    if (radius < 50) {
        
        L.circle(e.latlng, radius).addTo(mymap);
    }
    else {
        console.log("Setting view back");
        mymap.flyTo([40.3474, -74.6581], 18);
        console.log("Did the fly");
    }
}

function onLocationError(e) {
    console.log("Location failed");
    mymap.flyTo([40.3474, -74.6581], 18);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

mymap.locate({setView: true, enableHighAccuracy: true}); 


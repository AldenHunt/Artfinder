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
    var radius = e.accuracy/2;
    // Only print circle if pretty sure in the location panned to
    if (radius < 50) {    
        L.circle(e.latlng, radius).addTo(mymap);
    }
    else {
        mymap.flyTo([40.3474, -74.6581], 18);
    }
}

//If error, note in console
function onLocationError(e) {
    console.log("Error: Location failed");
    mymap.flyTo([40.3474, -74.6581], 18);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

/* Automatically locates the user and sets the view to their location) */
mymap.locate({setView: true, enableHighAccuracy: true});

/* Adds markers for all objects to map, with popup displaying information. */
function addMarkers(){
    /* objects is passed from server to map.html with jinja2. */
    var objdata = JSON.parse(objects);

    for (item in objdata) {
        var marker = L.marker([objdata[item]["lat"], objdata[item]["long"]]).addTo(mymap);
        var title = objdata[item]["title"];
        var creators = objdata[item]["creators"];
        var link = objdata[item]["objectid"];
        var data = ("<b>" + "<a href=objects/" + link + ">" + title + "</a>" + "</b><br>" + creators);
        marker.bindPopup(data).openPopup();
    }
}

addMarkers();

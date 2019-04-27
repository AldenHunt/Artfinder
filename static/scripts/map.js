// Initial Leaflet javascript - get map and center on Princeton
var corner1 = L.latLng(40.354, -74.645),
corner2 = L.latLng(40.334, -74.672),
bounds = L.latLngBounds(corner1, corner2);

//map flies to these coordinates if location does not work or not turned on
var defaultLat = 40.3474;
var defaultLng = -74.6581;

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
    if (radius > 100) {
        alert("Location may not be accurate on devices without GPS functionality")
    } 
        L.circle(e.latlng, radius).addTo(mymap);
        var data = {
            lat: e.latlng.lat.toString(),
            lng: e.latlng.lng.toString()
        }
        // send location to server, returns info for 5 closest art pieces
        $.ajax({
            type: 'POST',
            url: '/map',
            data: data,
            success: function(data){
                data = JSON.parse(data)
                $('#locationHeader').append('We\'ve found the top 5 closest art pieces to you');
                for (item in data) {
                    var title = data[item]["title"];
                    var creators = data[item]["creators"];
                    var dist = Math.round(data[item]["dist"]);
                    var link = data[item]["objectid"]
                    var position = Number(item) + 1;
                    link = "<a href=objects/" + link + ">"
                    $('#sideLocate').append(position + ". " + "<b>" + link + title + "<br>");
                    $('#sideLocate').append(creators + "<br>" + dist + " feet<br>");
                }
            }
        })

}

//If error, note in console
function onLocationError(e) {
    console.log("Error: Location failed");
    //default to location of Princeton University Art Museum
    sideBarNoLocation();

}

// Populates side bar if no location services or error in location services, using art museum as default location
function sideBarNoLocation(){
    mymap.flyTo([defaultLat, defaultLng], 18);
    var data = {
        lat: defaultLat.toString(),
        lng: defaultLng.toString()
    }
    $.ajax({
        type: 'POST',
        url: '/map',
        data: data,
        success: function(data){
            data = JSON.parse(data)
            $('#locationHeader').append('We can\'t find your exact location. Here are objects close to the Princeton University Art Museum');
            for (item in data) {
                var title = data[item]["title"];
                var creators = data[item]["creators"];
                var dist = Math.round(data[item]["dist"]);
                var link = data[item]["objectid"]
                var position = Number(item) + 1;
                link = "<a href=objects/" + link + ">"
                $('#sideLocate').append(position + ". " + "<b>" + link + title + "<br>");
                $('#sideLocate').append(creators + "<br>");
            }
        }
    })

}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

/* Automatically locates the user and sets the view to their location) */
/* Automatically locates the user and sets the view to their location) */
mymap.locate({setView: true, timeout: 5000, maximumAge: 30000, enableHighAccuracy: true});

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

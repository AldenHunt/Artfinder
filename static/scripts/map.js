// Initial Leaflet javascript - get map and center on Princeton
var corner1 = L.latLng(40.36, -74.64),
corner2 = L.latLng(40.33, -74.68),
bounds = L.latLngBounds(corner1, corner2);

// map flies to these coordinates if location does not work or not turned on
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
    console.log(radius);
    // Only print circle if pretty sure in the location panned to 
    if (radius > 175) {
        alert("Location may not be accurate on devices without GPS functionality");
    }
        L.circle(e.latlng, radius).addTo(mymap);
        var data = {
            lat: e.latlng.lat.toString(),
            lng: e.latlng.lng.toString()
        }
        mymap.flyTo([data["lat"], data["lng"]], 18);
        // send location to server, returns info for 5 closest art pieces
        $.ajax({
            type: 'POST',
            url: '/map',
            data: data,
            success: function(data){
                data = JSON.parse(data)
                $('#locationHeader').html('Closest art pieces to you');
                for (item in data) {
                    var title = data[item]["title"];
                    var creators = data[item]["creators"];
                    var dist = Math.round(data[item]["dist"]);
                    var link = data[item]["objectid"]
                    var imgURI = data[item]["image"];
                    var position = Number(item) + 1;
                    var htmlTextId = '#sideLocate' + position;
                    var htmlImageId = '#sideLocateImage' + position;
                    var imgArray = imgURI.split(',');
                    var imgLink = imgArray[0];
                    link = "<a href=objects/" + link + ">"
                    $(htmlTextId).append(position + ". " + "<b>" + link + title + "<br>");
                    $(htmlTextId).append(creators + "<br>" + dist + " feet<br>");
                    $(htmlImageId).append("<img src="+imgLink+"/full/full/0/default.jpg alt="+title+" style = 'width:75px' height=auto vspace= 5px>");
                }
            }
        })
    locateOnMap();
}

//If error, note in console
function onLocationError(e) {
    console.log("Error: Location failed");
    //default to location of Princeton University Art Museum
    sideBarNoLocation();
    locateOnMap();
}

// Populates side bar if no location services or error in location services, using art museum as default location
function sideBarNoLocation(){
    mymap.flyTo([defaultLat, defaultLng], 18);
    var data = {
        lat: defaultLat.toString(),
        lng: defaultLng.toString()
    };
    $.ajax({
        type: 'POST',
        url: '/map',
        data: data,
        success: function(data){
            data = JSON.parse(data)
            $('#locationHeader').html('We can\'t find your exact location. Here are objects close to the Princeton University Art Museum');
            for (item in data) {
                var title = data[item]["title"];
                var creators = data[item]["creators"];
                var link = data[item]["objectid"]
                var position = Number(item) + 1;
                var imgURI = data[item]["image"];
                var htmlTextId = '#sideLocate' + position;
                var htmlImageId = '#sideLocateImage' + position;
                var imgArray = imgURI.split(',');
                var imgLink = imgArray[0];
                link = "<a href=objects/" + link + ">"
                $(htmlTextId).append(position + ". " + "<b>" + link + title + "<br>");
                $(htmlTextId).append(creators + "<br>");
                $(htmlImageId).append("<img src="+imgLink+"/full/full/0/default.jpg alt="+title+" style = 'width:75px' height=auto vspace= 5px>");
            }
        }
    })

}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

/* Automatically locates the user and sets the view to their location) */
/* doesn't set the view if query string contains a valid id */
mymap.locate({setView: false, timeout: 5000, maximumAge: 30000, enableHighAccuracy: true});

// centers the map view on the object with the id in query string
function locateOnMap() {
    var objdata = JSON.parse(objects);
    var id = JSON.parse(obj_id);
    for (item in objdata) {
        if (objdata[item]["objectid"] == id) {
            mymap.flyTo(new L.LatLng(objdata[item]["lat"], objdata[item]["long"]), 18);
            return;
        }
    }
}

/* Adds markers for all objects to map, with popup displaying information. */
function addMarkers(){
    /* objects is passed from server to map.html with jinja2. */
    var objdata = JSON.parse(objects);

    for (item in objdata) {
        // custom icon for map marker
        var customIcon = L.icon({
            iconUrl: '/static/icon_blue.png',
            iconSize: [30, 30], // size of the icon
            popupAnchor: [0,-5]
            });
        var marker = L.marker([objdata[item]["lat"], objdata[item]["long"]], {icon: customIcon}).addTo(mymap);
        var title = objdata[item]["title"];
        var creators = objdata[item]["creators"];
        var link = objdata[item]["objectid"];
        var imgURI = objdata[item]["image"];
        var imgArray = imgURI.split(',');
        var imgLink = imgArray[0];
        var data = ("<div class='row'><div class='col'><img src="+imgLink+"/full/full/0/default.jpg alt="+title+" style='width: 120px' height=auto></div><div class='col'><b>" + "<a href=objects/" + link + " id='title'>" + title + "</a>" + "</b>" + creators+"</div>");
        marker.bindPopup(data);
    }
}

addMarkers();

var nearestButton = document.getElementById("nearesttoggle")
$('#nearesttoggle').hide()

$('#dismiss').on("click", function() {
    $('#nearesttoggle').show()
    $('#nearest').toggleClass('active');
})

$('#dismiss').on('click', function() {
    nearestButton.style.display = "block";
})

$('#nearesttoggle').on('click', function() {
    nearestButton.style.display = "none"
    $('#nearest').toggleClass('active');
})

// taken from https://stackoverflow.com/questions/44757839/link-to-a-specific-point-on-leaflet-map
function getQueryStringValue (key) {  
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  } 
var lat = getQueryStringValue("lat");
var lng = getQueryStringValue("lng");
var zoom = getQueryStringValue("zoom");

mymap.flyTo([lat, lng], zoom);

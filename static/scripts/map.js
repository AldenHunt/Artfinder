// Initial Leaflet javascript - get map and center on Princeton
var corner1 = L.latLng(40.36, -74.64),
corner2 = L.latLng(40.33, -74.68),
bounds = L.latLngBounds(corner1, corner2);

// map flies to these coordinates if location does not work or not turned on
var defaultLat = 40.3474;
var defaultLng = -74.6581;

var mymap = L.map('mapid', {maxBounds: bounds, minZoom: 15, maxZoom: 19}).setView([40.3474, -74.6581], 17);

var idMarkers = new Map();

// triggers the adjustSidebar function when the window is resized
window.onresize = adjustSidebar;
// will only adjust on resize if this is true
var adjust = true;

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
        console.log("Location may not be accurate on devices without GPS functionality");
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
                    var id = data[item]["objectid"]
                    var imgURI = data[item]["image"];
                    var position = Number(item) + 1;
                    var htmlTextId = '#sideLocate' + position;
                    var htmlImageId = '#sideLocateImage' + position;
                    var imgArray = imgURI.split(',');
                    var imgLink = imgArray[0];

                    var link = "<button class=\"btn btn-link\" onclick=locateByID(" + id + ")>"
                    $(htmlTextId).append(position + ". " + "<b>" + link + title);
                    $(htmlTextId).append("<br>");
                    $(htmlTextId).append(creators + "<br>" + dist + " feet<br>");
                    $(htmlImageId).append("<img src="+imgLink+"/full/full/0/default.jpg alt="+title+" style = 'width:75px' height=auto vspace= 5px>");
                    recolorMarker(item, id);
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
                var id = data[item]["objectid"]
                var position = Number(item) + 1;
                var imgURI = data[item]["image"];
                var htmlTextId = '#sideLocate' + position;
                var htmlImageId = '#sideLocateImage' + position;
                var imgArray = imgURI.split(',');
                var imgLink = imgArray[0];
                var link = "<button class=\"btn btn-link\" onclick=locateByID(" + id + ")>"
                $(htmlTextId).append(position + ". " + "<b>" + link + title);
                $(htmlTextId).append("<br>");
                $(htmlTextId).append(creators + "<br>");
                $(htmlImageId).append("<img src="+imgLink+"/full/full/0/default.jpg alt="+title+" style = 'width:75px' height=auto vspace= 5px>");
                recolorMarker(item, id);
            }
        }
    })

}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

// changes the color of the icon based on the rank in the "nearest items" list
function recolorMarker(rank, id) {
    var color;
    if (rank == 0) {
        color = 'red';
    } else if (rank == 1) {
        color = 'orange';
    } else if (rank == 2) {
        color = 'yellow';
    } else if (rank == 3) {
        color = 'green';
    } else {
        color = 'purple';
    }
    var customIcon = L.icon({
        iconUrl: '/static/icon_'+color+'.png',
        iconSize: [30, 30], // size of the icon
        popupAnchor: [0,-5]
    });
    var objdata = JSON.parse(objects);
    var marker = idMarkers.get(id);
    marker.setIcon(customIcon);
}

/* Automatically locates the user and sets the view to their location) */
/* doesn't set the view if query string contains a valid id */
mymap.locate({setView: false, timeout: 5000, maximumAge: 30000, enableHighAccuracy: true});

// centers the map view on the object with the given id
function locateByID(id) {
    // adjust sidebar and maintain value for "adjust"
    var tmp = adjust;
    adjust = true;
    adjustSidebar();
    adjust = tmp;
    // zoom to and popup appropriate marker
    console.log("Called!");
    var objdata = JSON.parse(objects);
    for (item in objdata) {
        if (objdata[item]["objectid"] == id) {
            mymap.flyTo(new L.LatLng(objdata[item]["lat"], objdata[item]["long"]), 18);
            var marker = idMarkers.get(objdata[item]["objectid"]);
            marker.openPopup();
            return;
        }
    }
}

// centers the map view on the object with the id in query string
function locateOnMap() {
    var objdata = JSON.parse(objects);
    var id = JSON.parse(obj_id);
    for (item in objdata) {
        if (objdata[item]["objectid"] == id) {
            mymap.flyTo(new L.LatLng(objdata[item]["lat"], objdata[item]["long"]), 18);
            var marker = idMarkers.get(objdata[item]["objectid"]);
            marker.openPopup();
            return;
        }
    }
}

// expands or collapses (or does nothing to) the sidebar, depending on screen size
function adjustSidebar() {
    // collapse on these conditions
    var nearest = document.getElementById("nearest");
    if (window.innerWidth < 750 && nearest.classList.contains("show") && adjust) {
        // do all the collapsing
        console.log("collapse");
        $('#nearest').hide();
        $('#nearesttoggle').show();
        $('#nearest').toggleClass('active');
        $('#nearest').toggleClass('show');
        document.getElementById("nearesttoggle").style.display = "block";
    }
    // expand on these conditions
    else if (window.innerWidth >= 750 && !nearest.classList.contains("show") && adjust) {
        // do all the expanding
        console.log("expand");
        $('#nearest').show();
        $('#nearesttoggle').hide()
        document.getElementById("nearesttoggle").style.display = "none";
        $('#nearest').toggleClass('active');
        $('#nearest').toggleClass('show');
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
        idMarkers.set(objdata[item]["objectid"], marker);
    }
}

addMarkers();

var nearestButton = document.getElementById("nearesttoggle")
$('#nearesttoggle').hide();

$('#dismiss').on("click", function() {
    $('#nearesttoggle').show()
    $('#nearest').toggleClass('active');
    $('#nearest').hide();
    adjust = false;
})

$('#dismiss').on('click', function() {
    nearestButton.style.display = "block";
})

$('#nearesttoggle').on('click', function() {
    nearestButton.style.display = "none"
    $('#nearest').toggleClass('active');
    $('#nearest').show();
    adjust = false;
})




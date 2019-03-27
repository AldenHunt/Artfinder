// Initial Leaflet javascript - get map and center on Princeton
var corner1 = L.latLng(40.3520, -74.6475),
corner2 = L.latLng(40.34, -74.662),
bounds = L.latLngBounds(corner1, corner2);

var mymap = L.map('mapid', {maxBounds: bounds,}).setView([40.3452, -74.6561], 17);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYWNodW50IiwiYSI6ImNqdGF4Ym5odzBmbTE0M2w4ZGpyamhsbWEifQ.2wopZqSc9U4D3jIaWcQnIg',
}).addTo(mymap);
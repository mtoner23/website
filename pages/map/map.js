let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapTypeId: 'satellite'
    });
}

myGeoCode = fetch('https://maps.googleapis.com/maps/api/geocode/json?address=Germany&key=GMAPS_API')
    .then(response => response.json())
    .then(data => console.log(data));


function createMap(){
    // add BFS function with two agruments: starting airport and ending airport

    /* TLL = Tallinn, RIX = Riga
     * SVO = Moscow, OSL = Oslo
     * FRA = Frankfurt, BGY = Bergamo
     * CDG = Paris, DBV = Dubrovnik
     * SPU = Split, LIS = Lisbon
     * DSS = Dakar, AGA = Agadir
    */
    // let airports = airports.json

    var mymap = L.map('mapid').setView([59.414018, 24.833489], 13);
    
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    var tlncoord = [59.414018, 24.833489];
    var markertln = L.marker(tlncoord).addTo(mymap);
    markertln.bindPopup("TLL");

    var rigacoord = [56.9226554, 23.9749147];
    var markerriga = L.marker(rigacoord).addTo(mymap);
    markerriga.bindPopup("RIX");

    // create a red polyline from an array of LatLng points
    // var latlngs = [
    //     [45.51, -122.68],
    //     [37.77, -122.43],
    //     [34.04, -118.2]
    // ];

    var polyline = L.polyline([tlncoord, rigacoord], {color: 'red', weight: 3}).addTo(mymap);

    // zoom the map to the polyline
    mymap.fitBounds(polyline.getBounds());
}
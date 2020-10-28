const airports = {
    "TLL":
    {
        "coord": [59.414018, 24.833489], 
        "linked_cities": ["RIX", "SVO", "OSL", "FRA", "BGY"]
    },
    "RIX":
    {
        "coord": [56.9226554, 23.9749147],
        "linked_cities": ["TLL", "SVO", "SPU", "DBV", "LIS"]
    },
    "BGY":
    {
        "coord": [45.668656, 9.703288],
        "linked_cities": ["TLL", "RIX", "DSS"]
    },
    "SVO":
    {
        "coord": [55.972599, 37.414600],
        "linked_cities": ["TLL", "RIX"]
    },
    "OSL":
    {
        "coord": [60.193901, 11.100400],
        "linked_cities": ["TLL"]
    },
    "FRA":
    {
        "coord": [50.033333, 8.570556],
        "linked_cities": ["TLL"]
    },
    "SPU":
    {
        "coord": [43.538898, 16.298000],
        "linked_cities": ["RIX"]
    },
    "DBV":
    {
        "coord": [42.561401, 18.268200],
        "linked_cities": ["RIX"]
    },
    "LIS":
    {
        "coord": [38.781300, -9.135920],
        "linked_cities": ["RIX", "AGA"]
    },
    "DSS":
    {
        "coord": [14.670000, -17.073333],
        "linked_cities": ["BGY"]
    },
    "AGA":
    {
        "coord": [30.325001, -9.413070],
        "linked_cities": ["LIS"]
    }
};

function createMap(){
    // add BFS function with two agruments: starting airport and ending airport
    var mymap = L.map('mapid').setView([59.414018, 24.833489], 5);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);


    /* TLL = Tallinn, RIX = Riga
     * SVO = Moscow, OSL = Oslo
     * FRA = Frankfurt, BGY = Bergamo
     * CDG = Paris, DBV = Dubrovnik
     * SPU = Split, LIS = Lisbon
     * DSS = Dakar, AGA = Agadir
    */
    
    // var polyline = L.polyline([tlncoord, rigacoord], {color: 'red', weight: 3}).addTo(mymap);
    // zoom the map to the polyline
    // mymap.fitBounds(polyline.getBounds());
    drawAirportLines(mymap);
}

function drawAirportLines(map){
    for([key, value] of Object.entries(airports)){
        var markertln = L.marker(value.coord).addTo(map);
        markertln.bindPopup(key);
    }
}

function findPlaces(){
    let visited = [];
    const fromAirport = document.getElementById("FromAirport").value;
    const toAirport = document.getElementById("ToAirport").value;
    let queue = [];
    queue.push(fromAirport);
    let foundPath = false;

    // visited[fromAirport] = true;
    /* visited[TLL] = true
     * visited[BGY] = true
     * visited[AGA] = true
     */

    while (foundPath != true) {
        let startingpoint = queue.pop();
        if (toAirport === startingpoint) {
            break;
        }
        visited.push(startingpoint);
        for (city of airports[startingpoint].linked_cities) {
            if (visited.includes(city) === false) {
                queue.push(city);
            }
            else if (visited.includes(city) === true && airports[startingpoint].linked_cities.length === 1) {
                visited.splice(visited.indexOf(startingpoint), 1);
            }
            if (toAirport === city) {
                foundPath = true;
                visited.push(city);
                break;
            }
        }
    }

    let places = [];
    let path = buildRoute(places, fromAirport, toAirport);

    console.log(visited);
    if(queue == false) console.log("Cant build route!");

    console.log(fromAirport, toAirport);
}

function buildRoute(places, start, end){
    let startingAirport = airports.start.linked_cities.pop();
    for (city of airports.startingAirport.linked_cities) {
        if (end === city) {
            return true;
        } else {
            buildRoute(startingAirport, end);
        }
    }
}

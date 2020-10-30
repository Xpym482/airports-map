/* 
    * TLL = Tallinn, RIX = Riga
    * SVO = Moscow, OSL = Oslo
    * FRA = Frankfurt, BGY = Bergamo
    * CDG = Paris, DBV = Dubrovnik
    * SPU = Split, LIS = Lisbon
    * DSS = Dakar, AGA = Agadir
*/
const airports = {
    "TLL":
        {
            "coord": [59.414018, 24.833489],
            "linked_cities": ["RIX", "SVO", "FRA", "BGY"]
        },
    "KAZ":
        {
            "coord": [51.044973, 71.169684],
            "linked_cities": ["OSL"]
        },
    "RIX":
        {
            "coord": [56.9226554, 23.9749147],
            "linked_cities": ["TLL", "SVO", "SPU", "DBV", "LIS", "BGY"]
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
            "linked_cities": ["KAZ"]
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

let mymap;

function createMap(){
    mymap = L.map('mapid').setView([59.414018, 24.833489], 5);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    for([key, value] of Object.entries(airports)){
        var markertln = L.marker(value.coord).addTo(mymap);
        markertln.bindPopup(key);
    }

    airportsListCreate();
}

function airportsListCreate(){
    let divPlace = document.getElementById("airportsList");
    let airportsList = document.createElement("ul");
    divPlace.appendChild(airportsList);
    for (city of Object.keys(airports)) {
        let node = document.createElement("li");
        let textNode = document.createTextNode(city);
        node.appendChild(textNode);
        airportsList.appendChild(node);
    }
}


function findPlaces(){
    let route = [];
    let queue = [];
    let visited = [];
    let result = false;
    let foundPath = false;
    const fromAirport = document.getElementById("FromAirport").value;
    const toAirport = document.getElementById("ToAirport").value;

    if (fromAirport == "" || toAirport == "") {
        alert("Need to start point and end point!");
        return null;
    }

    if (!Object.keys(airports).includes(fromAirport) || !Object.keys(airports).includes(toAirport)) {
        alert("Wrong airport name!");
        return null;
    }

    queue.push(fromAirport);

    while (queue != false) {
        // Clear airports from route if we dont need them except starting airport
        if (route != false) {
            route.splice(route.indexOf(fromAirport) + 1, route.length - 1);
            foundPath = false;
        }
        // Checked all airports but did not find toAirport
        if (visited.length === Object.keys(airports).length) {
            queue = [];
            break;
        }

        while (foundPath != true) {
            let startingpoint = queue.pop();
            route.push(startingpoint);

            // Add airport to visited without dublicates
            if (!visited.includes(startingpoint)) {
                visited.push(startingpoint);
            }

            let countAddedAirports = 0;
            for (city of airports[startingpoint].linked_cities) {
                // If we found end airport add it to path and end all while
                if (toAirport === city) {
                    foundPath = true;
                    route.push(city);
                    queue = [];
                    result = true;
                    break;
                }
                // If this city is not already in route && queue add it to queue
                if (route.includes(city) === false && queue.includes(city) === false && visited.includes(city) === false) {
                    queue.push(city);
                    countAddedAirports++;
                }
            }
            // If this city cant add new linked cities, then we dont need it
            if (countAddedAirports === 0) {
                foundPath = true;
            }

        }
    }
    console.log(route);
    drawRoute(route, toAirport);
}

function drawRoute(flight, endpoint){

    if (flight.length <= 1) {
        alert("Cant build route!");
        return null;
    }

    if (flight[flight.length - 1] !== endpoint) {
        alert("This airport is not connected!");
        return null;
    }

    let coordinates = flight.map((city) => {
        return airports[city].coord;
    })
    var polyline = L.polyline(coordinates, {color: 'red', weight: 3}).addTo(mymap);
    // zoom the map to the polyline
    mymap.fitBounds(polyline.getBounds());

}

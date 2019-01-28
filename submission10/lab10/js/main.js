
var allData;
var numericalAttributes = ["id","lastCommWithServer","lat",
                           "latestUpdateTime","long","nbBikes",
                           "nbEmptyDocks"];

var bostonLocation = [42.3601,-71.0589];
var stationCount;

// Variable for the visualization instance
var stationMap;


// Start application by loading the data
loadData();

function loadData() {

    // Proxy url
    var proxyUrl = 'http://michaeloppermann.com/proxy.php?format=xml&url=';

    // Hubway XML station feed
    var url = 'https://member.bluebikes.com/data/stations/bikeStations.xml';

    // LOAD DATA

    // Send an asynchronous HTTP request with jQuery
    $.getJSON(proxyUrl + url, function(jsonData){

        console.log(jsonData);

        // Extract list with stations from JSON response
        jsonData.station.forEach(function(d) {
          numericalAttributes.forEach(function(e){
            d[e] = +d[e];
          });
        });

        allData = jsonData.station;

        // Count number of stations
        stationCount = allData.length;

        console.log(allData);

        createVis();
    });



}


function createVis() {

    // INSTANTIATE VISUALIZATION

    // Show number of stations with JQuery
    $(function () {
      $("#station-count").html(stationCount);
    });

    // Instantiate visualization object (bike-sharing stations in Boston)
    stationMap = new StationMap("station-map", allData, bostonLocation);

}

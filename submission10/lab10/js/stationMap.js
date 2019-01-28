
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

	this.parentElement = _parentElement;
	this.data = _data;
  this.mapPosition = _mapPosition;

	this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
	var vis = this;

  // Change leaflet default image path
  L.Icon.Default.imagePath = 'img/';

  // Instatiate map
  vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(vis.map);

  // Create layer for station markers
  vis.stations = L.layerGroup().addTo(vis.map);

  vis.lines = L.layerGroup().addTo(vis.map);

  // Import geoJSON data for the T
  $.getJSON('data/MBTA-Lines.json', function(jsonData) {
    // Add the MBTA lines to the map
    var transportation = L.geoJson(jsonData, {
      style: styleLines,
      weight: 8
    });

    vis.lines.addLayer(transportation);
  });

  function styleLines(feature) {
    switch (feature.properties.LINE) {
      case "RED": return { color: "#E33129" };
      case "GREEN": return { color: "#409556" };
      case "ORANGE": return { color: "#EE8633" };
      case "BLUE": return { color: "#2765BF" };
      case "SILVER": return { color: "#898AB9" };
    }
  }

	vis.wrangleData();
}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
  var vis = this;

  vis.data.forEach(function (d) {
    var popupContent =  "<strong>" + d.name + "</strong><br/>";
  	popupContent += ("Available bikes: " + d.nbBikes + "<br/>");
    popupContent += ("Available docks: " + d.nbEmptyDocks + "<br/>");

    // Create a marker and bind a popup with a particular HTML content
    var marker = L.marker([d.lat, d.long])
    	.bindPopup(popupContent);

    vis.stations.addLayer(marker);
  });
}

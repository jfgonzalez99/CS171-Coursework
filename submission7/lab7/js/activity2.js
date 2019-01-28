var width = 1000,
    height = 600;

var rotation = [-10, -60];

var svg = d3.select("#map-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// var projection = d3.geoMercator()
//     .translate([width / 2, height / 2])
//     .scale(135)
//     .center([0, 40]);

var projection = d3.geoOrthographic()
       .translate([width / 2, height / 2])
       .rotate(rotation)
       .scale(300);

// var projection = d3.geoConicEqualArea()
//         .translate([width / 2, height / 2])
//         .scale(180);

var path = d3.geoPath()
    .projection(projection);


// Load data parallel
queue()
    .defer(d3.json, "data/airports.json")
    .defer(d3.json, "data/world-110m.json")
    .await(createVisualization);


// Load shapes of U.S. counties (TopoJSON)
function createVisualization(error, data1, data2) {

  console.log(data1);
  console.log(data2);

	// Convert TopoJSON to GeoJSON (target object = 'states')
	var world = topojson.feature(data2, data2.objects.countries).features
  console.log(world);

	// Render the world by using the path generator
	svg.selectAll("path")
			.data(world)
		.enter().append("path")
			.attr("d", path)
      .attr("class", "map-path");

  svg.selectAll("circle")
      .data(data1.nodes)
    .enter().append("circle")
      .attr("class", "airports")
      .attr("r", 3)
      .attr("transform", function(d) {
           return "translate(" + projection([d.longitude, d.latitude]) + ")";
       })

}

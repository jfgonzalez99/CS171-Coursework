
// Global variables
var includedCountries = [];
var countryDataById = {};
var extents = {};
var mapGeoJson;

// --> CREATE SVG DRAWING AREA
var width = 900,
    height = 600;

var mapCenter = [50,0];

var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

var legendSVG = d3.select("#legend").append("svg")
        .attr("width", width / 2)
        .attr("height", height);

// Create static legend elements
legendSVG.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x",25)
        .attr("y", 120)
        .attr("fill", "#7B9BA6");

legendSVG.append("text")
        .attr("class", "legend-label")
        .attr("x", 55)
        .attr("y", 136.5)
        .text("Data for this country is not included");

var greens = d3.scaleOrdinal(d3.schemeGreens[9]);
var blues = d3.scaleOrdinal(d3.schemeBlues[9]);
var reds = d3.scaleOrdinal(d3.schemeReds[9]);

// Define Mercator Projection
var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(350)
    .center(mapCenter);

var path = d3.geoPath()
    .projection(projection);

// Use the Queue.js library to read two files
queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-water-sanitation-2015.csv")
  .await(function(error, mapTopJson, countryDataCSV){

    // PROCESS DATA
    // Convert topoJSON to geoJSON
    mapGeoJson = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;

    console.log(mapGeoJson);

    // Filter country data for just African countries
    var filteredCountries = countryDataCSV.filter(function(d){
      return d.WHO_region == "African" || d.WHO_region == "Eastern Mediterranean";
    })

    filteredCountries.forEach(function(d){
      // Convert numer strings to numbers
      d.Improved_Sanitation_2015 = +d.Improved_Sanitation_2015;
      d.Improved_Water_2015 = +d.Improved_Water_2015;
      d.UN_Population = +d.UN_Population;

      // Add country id's to list of included countries
      includedCountries.push(d.Code);

      // Create new JSON structure organized by country id
      countryDataById[d.Code] = {"WHO_region":d.WHO_region,
                                 "Country":d.Country,
                                 "Improved_Sanitation_2015":d.Improved_Sanitation_2015,
                                 "Improved_Water_2015":d.Improved_Water_2015,
                                 "UN_Population":d.UN_Population};
    })

    console.log(includedCountries);
    console.log(countryDataById);

    // Set domains for color scales

    // console.log(d3.extent(filteredCountries, function(d) { return d.UN_Population; }));
    // console.log(d3.extent(filteredCountries, function(d) { return d.Improved_Water_2015; }));
    // console.log(d3.extent(filteredCountries, function(d) { return d.Improved_Sanitation_2015; }));

    extents.UN_Population = d3.extent(filteredCountries, function(d) {
                              return d.UN_Population;
                            });
    extents.Improved_Water_2015 =
                            d3.extent(filteredCountries, function(d) {
                              return d.Improved_Water_2015;
                            });

    extents.Improved_Sanitation_2015 =
                            d3.extent(filteredCountries, function(d) {
                              return d.Improved_Sanitation_2015;
                            });

    console.log(extents);

    // Population scale
    greens.domain(extents.UN_Population);

    // Water access scale
    blues.domain(extents.Improved_Water_2015);

    // Sanitation access scale
    reds.domain(extents.Improved_Sanitation_2015);

    // for (var i = 0; i < 9; i++) {
    //   green[i] = greens()
    // }

    // Update map
    updateChoropleth();

  });

function updateChoropleth() {

  var colors;
  var selected;

  // Update selcted value
  selected = document.getElementById("selector").value;
  console.log(selected);

  if (selected == "UN_Population") {
    colors = greens;
  }
  else if (selected == "Improved_Water_2015") {
    colors = blues;
  }
  else {
    colors = reds;
  }

  // Set up legend
  var stepWidth = (extents[selected][1] - extents[selected][0]) / 9;
  var scaleSteps = [extents[selected][0]];

  for (var i = 1; i < 10; i++) {
    scaleSteps.push(Math.round((scaleSteps[0] + stepWidth * i) * 10) / 10);
  }



  console.log(colors.range());
  console.log(extents[selected]);
  console.log(scaleSteps);

  // Render Africa by using the path generator
	var map = svg.selectAll("path")
			         .data(mapGeoJson);

  map.enter().append("path")
      .merge(map)
			.attr("d", path)
      .attr("class", "map-path")
      .attr("fill", function(d) {
        if (includedCountries.includes(d.properties.adm0_a3_is)) {
          return colors(countryDataById[(d.properties.adm0_a3_is)][selected]);
        }
        else {
          return "#7B9BA6";
        }
      })
      // Add tooltip
      // Tooltip inspired by sami rubenfeld
      // https://bl.ocks.org/sarubenfeld/56dc691df199b4055d90e66b9d5fc0d2
      .on("mouseover", function(d) {
        // var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
				// var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;


				d3.select("#tooltip")
					.style("left", (-5) + "px")
					.style("top", height / 2 + "px")
					.select("#value")
					.text(function() {
            if (includedCountries.includes(d.properties.adm0_a3_is)) {
              return countryDataById[(d.properties.adm0_a3_is)]["Country"] + ": " + countryDataById[(d.properties.adm0_a3_is)][selected];
            }
            else {
              return d.properties.name + "'s information is not included in this dataset"
            }
          });


				d3.select("#tooltip").classed("hidden", false);
      })
      .on("mouseout", function () {
        d3.select("#tooltip").classed("hidden", true)
      });

  // Update legend
  var legend = legendSVG.selectAll(".legend-scale")
                .data(colors.range());

  legend.enter().append("rect")
      .attr("class", "legend-scale")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x",25)
      .merge(legend)
      .attr("y", function(d,i) { return i * 20 + 180 })
      .attr("fill", function(d,i) { return d });

  var legendLabel = legendSVG.selectAll(".dynamic-label")
                .data(scaleSteps);

  legendLabel.enter().append("text")
      .attr("class", "dynamic-label legend-label")
      .attr("x", 55)
      .merge(legendLabel)
      .attr("y", function(d,i) { return i * 20 + 195 })
      .text(function(d,i) {
        if (i == 9) {
          return null;
        }
        else {
          return d + " - " + scaleSteps[i + 1];
        }
      })

  // Create dynamic title
  var title = d3.select("#category")
                .text(function() {
                  if (selected == "UN_Population") {
                    return "Population Sizes";
                  }
                  else if (selected == "Improved_Water_2015") {
                    return "(%) Water Accessibility";
                  }
                  else {
                    return "(%) Sanitation Accessibility";
                  }
                });

  map.exit().remove();
  legend.exit().remove();

}


// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Set selected value
var selected = d3.select("#ranking-type").property("value");

function updateSelected() {
  selected = d3.select("#ranking-type").property("value");
  console.log(selected);
  loadData();
}

// Scales
var x = d3.scaleBand()
    .rangeRound([0, width])
  .paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

// Create axes
var xAxis = d3.axisBottom()
              .scale(x);

var yAxis = d3.axisLeft()
              .scale(y);

// Create SVG
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append axes
var xAxisGroup = svg.append("g")
                    .attr("class", "x-axis axis")
                    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = svg.append("g")
                    .attr("class", "y-axis axis");

// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});

// Find the smallest and largest value in the selected field
function getDomain(data, field) {
  return [d3.min(data, function(d) { return d[field] }),
          d3.max(data, function(d) { return d[field] })];
}

// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv.sort(function(a, b) { return b[selected] - a[selected]; });

    // updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...
	});
}

// Render visualization
function updateVisualization() {

  console.log(data);

  // Set domains for scales
  var domainY = getDomain(data, selected);

  x.domain(data.map(function(d) { return d.company; }));
  y.domain([domainY[0], domainY[1]]);


  // Update axes
  svg.select(".x-axis")
    .transition()
    .duration(1000)
		.call(xAxis);

  svg.select(".y-axis")
    .transition()
    .duration(1500)
		.call(yAxis);

  // Create bars
  var bars = svg.selectAll("rect")
                .data(data);

  bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", x.bandwidth())
      .merge(bars)
      .attr("y", function(d) {
        return y(d[selected]);
      })
      // .transition()
      // .duration(1000)
      .attr("height", function(d) {
                        return height - y(d[selected]);
                      })
      .transition()
      .duration(1000)
      .attr("x", function(d,i) {
                   return x(d.company);
                 });


  bars.exit().remove();
}

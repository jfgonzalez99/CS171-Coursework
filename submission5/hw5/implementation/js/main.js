
// Date parser
var formatDate = d3.timeFormat("%Y");
var parseDate = d3.timeParse("%Y");

// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var textSVG = d3.select("#edition-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set default values
var selected = "GOALS";
var lowerYear = 1930;
var upperYear = 2014;


function updateSelected() {
  selected = d3.select("#select-box").property("value");
  console.log(selected);
	lowerYear = d3.select("#lowerYear").property("value");
	upperYear = d3.select("#upperYear").property("value");
	console.log(lowerYear, upperYear);
  loadData(lowerYear, upperYear);
}

// Create scales
var x = d3.scaleTime()
					.range([0,width]);

var y = d3.scaleLinear()
					.range([height, 0]);

// Find the smallest and largest value in the selected field
function getDomain(data, field) {
  return [d3.min(data, function(d) { return d[field] }),
          d3.max(data, function(d) { return d[field] })];
}

// Create axes
var xAxis = d3.axisBottom()
              .scale(x);

var yAxis = d3.axisLeft()
              .scale(y);

// Append axes
var xAxisGroup = svg.append("g")
                    .attr("class", "x-axis axis")
                    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = svg.append("g")
                  	.attr("class", "y-axis axis");


// Initialize data
loadData(lowerYear,upperYear);

// FIFA world cup
var data;
var filteredData;

// Define line
var line = d3.line()
	.x(function(d) { return x(d.YEAR); })
	.y(function(d) { return y(d[selected]); });

// Initialize tooltip
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.EDITION + ": " + d[selected]; });

svg.call(tip);


// Load CSV file
function loadData(lowerYear, upperYear) {
	d3.csv("data/fifa-world-cup.csv", function(error, csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = parseDate(d.YEAR);

			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		svg.append("path")
			.attr("class","line");

		filteredData = data.filter(function(d) {
			return (formatDate(d.YEAR) >= lowerYear && formatDate(d.YEAR) <= upperYear);
		})

		// Draw the visualization for the first time
		updateVisualization();
	});
}

// Render visualization
function updateVisualization() {

	console.log(filteredData);


	// Set domains
	xDomain = getDomain(filteredData, "YEAR");
	yDomain = getDomain(filteredData, selected);

	x.domain(xDomain);
	y.domain([0,yDomain[1]]);
	// console.log(x(formatDate(1990)));
	// console.log(y(171));

	// Update line
	svg.select(".line")
		.transition()
		.duration(800)
		.attr("d", line(filteredData));

	// Draw axes
  svg.select(".x-axis")
	.transition()
	.duration(800)
		.call(xAxis);

  svg.select(".y-axis")
		.transition()
		.duration(800)
		.call(yAxis);



	var circle = svg.selectAll("circle")
								.data(filteredData);

	circle.enter()
				.append("circle")
				.attr("class", "tooltip-circle")
				.attr("r", 3)
				.merge(circle)
				.on('mouseover', tip.show)
  			.on('mouseout', tip.hide)
				.on('click', function (d) {
					console.log(showEdition(d));
					showEdition(d); })
				.transition()
				.duration(800)
				.attr("cx", function(d) { return x(d.YEAR); })
				.transition()
				.duration(800)
				.attr("cy", function(d) { return y(d[selected]); });

	circle.exit().remove();

}


// Show details for a specific FIFA World Cup
function showEdition(d){
	var text = textSVG.selectAll("text")
              .data(d);

	text.enter()
	     .append("text")
	     .attr("y", (height / 2 + 5))
	     .attr("class", "order-label")
	     .merge(text)
	     .text(d.EDITION + "\n Winner: " + d.WINNER + "\n Goals: " + d.GOALS +
		 					"\n Average Goals: " + d.AVERAGE_GOALS + "\n Average Attendance: "
						  + d.AVERAGE_ATTENDANCE + "\n Matches: " + d.MATCHES + "\n Teams: "
						  + d.TEAMS);

	text.exit.remove();
}

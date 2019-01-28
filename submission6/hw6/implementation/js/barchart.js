

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BarChart = function(_parentElement, _data, _config){
	this.parentElement = _parentElement;
	this.data = _data;
	this.config = _config;
	this.displayData = _data;
  this.filteredData = _data;

	this.initVis();
}



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

  vis.margin = { top: 20, right: 0, bottom: 20, left: 100 };

	vis.width = 500 - vis.margin.left - vis.margin.right,
    vis.height = 200 - vis.margin.top - vis.margin.bottom;

  // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
       .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  // Scales and axes
  vis.x = d3.scaleLinear()
      .range([0, vis.width - 60]);

  vis.y = d3.scaleBand()
      .rangeRound([0, vis.height])
      .paddingInner(0.1);

  vis.yAxis = d3.axisLeft()
      .scale(vis.y);

  vis.svg.append("g")
      .attr("class", "y-axis axis");

	// (Filter, aggregate, modify data)
	vis.wrangleData();
}



/*
 * Data wrangling
 */

BarChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by key variable (e.g. 'electricity') and count leaves
	// (2) Sort columns descending

  var nestedData = d3.nest()
           .key(function(d) { return d[vis.config]; })
           .rollup(function(leaves) { return leaves.length; })
           .entries(vis.filteredData);

  console.log(nestedData);

  vis.displayData = nestedData.sort(function(a, b) { return b.value - a.value; });
  console.log(vis.displayData);

	// Update the visualization
	vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(){
	var vis = this;

	// (1) Update domains
	// (2) Draw rectangles
	// (3) Draw labels



	vis.x.domain([0, d3.max(vis.displayData, function(d) {
    return d.value;
  })]);
  console.log(vis.x.domain());



  vis.y.domain(vis.data.map(function(d) { return d.key; }));
  console.log(vis.y.domain());

  var bars = vis.svg.selectAll("rect")
                   .data(vis.displayData);
  bars.enter()
         .append("rect")
         .attr("x", 0)
         .attr("height", 30)
         .attr("class", "bars")
         .merge(bars)
         .attr("y", function(d) { return vis.y(d.key); })
         .attr("width", function(d) { return vis.x(d.value); });

  var tooltip = vis.svg.selectAll("text")
                       .data(vis.displayData);

  tooltip.enter()
         .append("text")
         // .merge(tooltip)
         .attr("y", function(d) { return vis.y(d.key) + 20; })
         .attr("x", function(d) { return vis.x(d.value) + 5; })
         .text(function (d) { return d.value; });


  tooltip.exit().remove();
  bars.exit().remove();

  // Call axis functions with the new domain
  vis.svg.select(".y-axis").call(vis.yAxis);
}



/*
 * Filter data when the user changes the selection
 * Example for brushRegion: 07/16/2016 to 07/28/2016
 */

BarChart.prototype.selectionChanged = function(brushRegion){
	var vis = this;

	// Filter data accordingly without changing the original data


	vis.filteredData = vis.data.filter(function(d) {
    return d.survey >= brushRegion[0] && d.survey <= brushRegion[1];
  });

  console.log(vis.filteredData);

	// Update the visualization
	vis.wrangleData();
}

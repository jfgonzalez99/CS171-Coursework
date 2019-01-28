
/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */

AreaChart = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = [];

	this.initVis();
}


/*
 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
 */

AreaChart.prototype.initVis = function(){
	var vis = this;

  vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.width = 500 - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
  	vis.svg = d3.select("#" + vis.parentElement).append("svg")
  	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
  	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
         .append("g")
  	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleTime()
              .range([0, vis.width]);

          vis.y = d3.scaleLinear()
              .range([vis.height, 0]);


          vis.xAxis = d3.axisBottom()
              .scale(vis.x);

        vis.yAxis = d3.axisLeft()
          .scale(vis.y);

  // Area layout
  vis.area = d3.area()
  		           .curve(d3.curveCardinal)
                 .x(function(d) { return vis.x(d.key); })
                 .y0(vis.height)
                 .y1(function(d) { return vis.y(d.value); });

                 vis.svg.append("g")
                       .attr("class", "x-axis axis")
                       .attr("transform", "translate(0," + vis.height + ")")
                       .call(vis.xAxis);

                       vis.svg.append("g")
                           .attr("class", "y-axis axis");

                           // Initialize brush component
  var brush = d3.brushX()
    .extent([[0, 0], [vis.width, vis.height]]);
    // .on("brush", brushed);

  // Append brush component here
  vis.svg.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", vis.height + 7);


	// (Filter, aggregate, modify data)
	vis.wrangleData();
}


/*
 * Data wrangling
 */

AreaChart.prototype.wrangleData = function(){
	var vis = this;

	// (1) Group data by date and count survey results for each day
	// (2) Sort data by day


  vis.displayData = vis.data.sort(function(a, b) { return a.key - b.key; });
  console.log(vis.displayData);
  console.log(vis.displayData[0]);

  vis.x.domain([vis.displayData[0].key, vis.displayData[vis.displayData.length - 1].key]);
  vis.y.domain([0, d3.max(vis.displayData, function(d) { return d.value; })]);

	// Update the visualization
	vis.updateVis();
}


/*
 * The drawing function
 */

AreaChart.prototype.updateVis = function(){
	var vis = this;


  // Draw area by using the path generator
    vis.svg.append("path")
        .datum(vis.displayData)
        .attr("fill", "#ccc")
        .attr("d", vis.area);



	// Call axis functions with the new domain
	vis.svg.select(".x-axis").call(vis.xAxis);
  vis.svg.select(".y-axis").call(vis.yAxis);
}

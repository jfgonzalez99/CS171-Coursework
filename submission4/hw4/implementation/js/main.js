// Define margin
var margin = {top: 20, right: 10, bottom: 80, left: 50};

// Define dimensions of chart area
var width = 550 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var shelterData = [{type: "Caravan", percent: .7968},
                   {type: "Caravan & Tent", percent: .1081},
                   {type: "Tent", percent: .0951}];

console.log(shelterData);

// Load CSV file
d3.csv("data/zaatari-refugee-camp-population.csv", function(data){

  console.log(data);
  var dataSize = data.length;

  // Convert strings to date objects
  var stringtoDate = d3.timeParse("%Y-%m-%d");
      bisectDate = d3.bisector(function(d) { return d.date; }).left; // **

  function formatDates(column) {
    for (var i = 0; i < dataSize; i++) {
      data[i][column] = stringtoDate(data[i][column]);
    }
  }

  formatDates("date");

  function stringtoInt(column) {
    for (var i = 0; i < dataSize; i++) {
      data[i][column] = +data[i][column];
    }
  }

  stringtoInt("population");

  // console.log(data[0].date);


  // Create SVG canvases
  var svgArea = d3.select("#area").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + ","
                                                  + margin.top + ")");

  var svg = d3.select("#area svg");

  var svgBar = d3.select("#bar").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + (margin.left + 90) + ","
                                                  + margin.top + ")");

  // Create scale for dates
  var minDate = d3.min(data,function(d){
                  return d["date"];
                });
  var maxDate = d3.max(data,function(d){
                  return d["date"];
                });

  // console.log(minDate);
  // console.log(maxDate);

  var dateScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, width]);

  // Scale population
  var maxPop = d3.max(data,function(d){
                 return d["population"];
               });

  var populationScale = d3.scaleLinear()
                          .domain([0,maxPop])
                          .range([height,0]);

  // Create ordinal scale for types of shelterData
  var typeScale = d3.scaleOrdinal()
                    .domain(["","Caravan","Caravan & Tent","Tent",""])
                    .range([0,45,115,185,230]);

  // Scale perecentages
  var percentageScale = d3.scaleLinear()
                          .domain([0, 1])
                          .range([height, 0]);

  // console.log(dateScale(data[0].date));
  // console.log(dateScale(data[140].date));
  // console.log(dateScale(data[dataSize - 1].date));
  // console.log(populationScale(0));
  // console.log(populationScale(maxPop));

  // Draw area
  var dataArea = d3.area()
                   .x(function(d){ return dateScale(d.date); })
                   .y1(function(d){ return populationScale(d.population); })
                   .y0(populationScale(0));

  var pathArea = svgArea.append("path")
                        .datum(data)
                        .attr("class", "area-chart")
                        .attr("d", dataArea);

  // Draw line
  // https://bit.ly/2QTpUo7
  var dataLine = d3.line()
                   .x(function(d){ return dateScale(d.date); })
                   .y(function(d){ return populationScale(d.population); });

  var lineSvg = svgArea.append("g").attr("fill", "none");                             // **********

  var focus = svgArea.append("g")                                // **********
                 .style("display", "none");                  // **********

  var pathLine = svgArea.append("path")
                        .datum(data)
                        .attr("class", "line-chart")
                        .attr("d", dataLine);

  // Draw bars
  var bars = svgBar.selectAll("rect")
                   .data(shelterData)
                   .enter()
                   .append("rect");

  bars.attr("x", function(d, index) { return index * 70 + 20; })
      .attr("y", function(d) { return percentageScale(d.percent); })
      .attr("class", "bars")
      .attr("width", 50)
      .attr("height", function(d) { return height - percentageScale(d.percent); });

  svgBar.selectAll("text")
        .data(shelterData)
        .enter()
        .append("text")
          .attr("class", "percent-label")
          .attr("x", function(d, index) { return index * 70 + 20; })
          .attr("y", function(d) { return percentageScale(d.percent); })
          .attr("transform", "translate(25,-4)")
          .text(function(d) {return (Math.round(d.percent * 10000) / 100) + "%"});

  // Define the line
  var valueline = d3.line()
        .x(function(d) { return dateScale(d.date); })
        .y(function(d) { return populationScale(d.population); });

  lineSvg.append("path")                                 // **********
         .attr("class", "line")
         .attr("d", valueline(data));

  // Set up axes
  var xAxis = d3.axisBottom()
                .scale(dateScale)
                .tickFormat(d3.timeFormat("%B %Y"));

  var yAxis = d3.axisLeft()
                .scale(populationScale);

  var xAxisBar = d3.axisBottom()
                   .scale(typeScale);

  var yAxisBar = d3.axisLeft()
                   .scale(percentageScale)
                   .tickFormat(d3.format(".0%"));

  // Draw axes
  svg.append("g")
     .attr("class","axis")
     .attr("transform","translate(" + margin.left + "," + (height + margin.top) + ")")
     .call(xAxis)
     .selectAll("text")
       .attr("transform", "translate(" + (-22) + "," + (margin.bottom / 2.5) + "),rotate(-65)");

  svg.append("g")
     .attr("class","axis")
     .attr("transform","translate(" + margin.left + ", " + margin.top + ")")
     .call(yAxis);

  d3.select("#bar svg").append("g")
        .attr("class","axis")
        .attr("transform","translate(" + (margin.left + 90) + "," + (height + margin.top) + ")")
        .call(xAxisBar);

  d3.select("#bar svg").append("g")
        .attr("class","axis")
        .attr("transform","translate(" + (margin.left+ 90) + ", " + margin.top + ")")
        .call(yAxisBar);



  // append the circle at the intersection               // **********
  focus.append("circle")                                 // **********
      .attr("class", "y")                                // **********
      .style("fill", "none")                             // **********
      .style("stroke", "blue")                           // **********
      .attr("r", 4);                                     // **********

  // append the rectangle to capture mouse               // **********
  svgArea.append("rect")                                     // **********
      .attr("width", width)                              // **********
      .attr("height", height)                            // **********
      .style("fill", "none")                             // **********
      .style("pointer-events", "all")                    // **********
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);                       // **********

  function mousemove() {                                 // **********
    var x0 = x.invert(d3.mouse(this)[0]),              // **********
        i = bisectDate(data, x0, 1),                   // **********
        d0 = data[i - 1],                              // **********
        d1 = data[i],                                  // **********
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;     // **********

    focus.select("circle.y")                           // **********
        .attr("transform",                             // **********
              "translate(" + dateScale(d.date) + "," +         // **********
                             populationScale(d.population) + ")");        // **********
  }                                                      // **********

});

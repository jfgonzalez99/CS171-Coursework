
// SVG Size
var width = 700,
	  height = 500;


// Load CSV file
d3.csv("data/wealth-health-2014.csv", function(data){

	// Analyze the dataset in the web console
	console.log(data);
  var dataSize = data.length;
	console.log("Countries: " + dataSize)

  // Activity I
  // Convert strings to ints
  function stringtoInt(column) {
    for (var i = 0; i < dataSize; i++) {
      data[i][column] = +data[i][column];
    }
  }

  stringtoInt("LifeExpectancy");
  stringtoInt("Income");
  stringtoInt("Population");

  // Append chart-area
  d3.select("body").append("div")
    .attr("id","chart-area")
    .append("svg")
      .attr("height",height)
      .attr("width",width);

  var svg = d3.select("#chart-area svg");

  // Find min and max values
  var minLife = d3.min(data,function(d){
    return d["LifeExpectancy"];
  });
  var maxLife = d3.max(data,function(d){
    return d["LifeExpectancy"];
  });

  var minIncome = d3.min(data,function(d){
    return d["Income"];
  });
  var maxIncome = d3.max(data,function(d){
    return d["Income"];
  });

  // console.log(minLife);
  // console.log(maxLife);
  // console.log(minIncome);
  // console.log(maxIncome);

  var padding = 30;
  var xPadding = 22;
  var yPadding = 20;

  // Set up scales
  var lifeExpectancyScale = d3.scaleLinear()
                              .domain([maxLife + 2,minLife - 2])
                              .range([padding, height - padding]);
  var incomeScale = d3.scaleLog()
                      .domain([minIncome,maxIncome])
                      .range([padding, width - padding]);

  // console.log(lifeExpectancyScale(68));
  // console.log(incomeScale(5000));

  // Sort data by population Size
  var dataSorted = data.sort(function(a, b) {
                     return b.Population - a.Population;
                   });

  console.log(dataSorted);

  // Activity II
  // Set up axes
  var xAxis = d3.axisBottom()
                .scale(incomeScale)
                // https://bit.ly/2EmDm2i
                .tickFormat(function (d) {
                  return incomeScale.tickFormat(7,d3.format(",d"))(d)
                });
  var yAxis = d3.axisLeft()
                .scale(lifeExpectancyScale);

  svg.append("g")
     .attr("class","axis")
     .attr("transform","translate(0," + (height - padding) + ")")
     .call(xAxis);

  // Add x-axis label
  svg.append("text")
     .attr("class", "label")
     .attr("transform","translate(500," + (height - padding * 1.25) + ")")
     .text("Income per Person (GDP per Capita)");

  svg.append("g")
     .attr("class","axis")
     .attr("transform","translate(" + padding + ",0)")
     .call(yAxis);

  // Add y-axis label
  svg.append("text")
     .attr("class", "label")
     .attr("transform","translate(" + (padding * 1.5) + ",107), rotate(270)")
     .text("Life Expectancy");

  // Activity III
  var minPop = d3.min(data,function(d){
    return d["Population"];
  });

  var maxPop = d3.max(data,function(d){
    return d["Population"];
  });

  var populationScale = d3.scaleLinear()
                      .domain([minPop,maxPop])
                      .range([4, 30]);

  var colorScheme = ["#92D9E3","#F4BB59","#F25652","#3A497A","#BE49A3","#78B257"];

  var colorScale = d3.scaleOrdinal()
                     .domain(["Europe & Central Asia",
                              "America",
                              "Middle East & North Africa",
                              "Sub-Saharan Africa",
                              "East Asia & Pacific",
                              "South Asia"])
                     .range(colorScheme);

  // Plot points
  var circles = svg.selectAll("circle")
                   .data(dataSorted)
                   .enter()
                   .append("circle");

  circles.attr("r",function(d){return populationScale(d.Population);})
         .attr("stroke", "grey")
         .attr("fill",function(d){return colorScale(d.Region);})
         .attr("cx",function(d){return incomeScale(d.Income);})
         .attr("cy",function(d){
                 return lifeExpectancyScale(d.LifeExpectancy);
               });
});

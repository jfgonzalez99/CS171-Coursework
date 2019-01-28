/* main JS file */

// Activity 1.4
d3.select("body").append("div").text("Dynamic Content");

// Activity 2.1
var svg = d3.select("body").append("svg")
            .attr("width", 500)
            .attr("height", 500);

svg

// Activity 2.2

var sandwiches = [
     { name: "Thesis", price: 7.95, size: "large" },
     { name: "Dissertation", price: 8.95, size: "large" },
     { name: "Highlander", price: 6.50, size: "small" },
     { name: "Just Tuna", price: 6.50, size: "small" },
     { name: "So-La", price: 7.95, size: "large" },
     { name: "Special", price: 12.50, size: "small" }
];

d3.select("body").append("svg")
  .attr("width", 800)
  .attr("height", 110)
.selectAll("circle")
  .data(sandwiches)
  .enter()
  .append("circle")
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("fill", function(d) {
                  if (d.price < 7) {
                    return ("lightblue");
                  }
                  else {
                    return ("pink");
                  }
                })
  .attr("r", function(d) {
               if (d.size == "large") {
                 return (50);
               }
               else {
                 return (25);
               }
             })
  .attr("cy", 55)
  .attr("cx", function(d, index) {
                return (index * 110 + 55);
              });

// Activity 3.2
d3.csv("data/cities.csv", function(data) {
  console.log(data);
	console.log(typeof(data[0].country));
  console.log(typeof(data[0].city));
  console.log(typeof(data[0].population));
  console.log(typeof(data[0].x));
  console.log(typeof(data[0].y));
  console.log(typeof(data[0].eu));
});

// Activity 3.3
d3.csv("data/cities.csv", function(data){
  console.log(data);
  var filteredData =
    data.filter(function(value, index) {
                  return (value.eu == "true");
                });
  // Activity 3.4
  var numEu = filteredData.length;
  console.log(filteredData);
  d3.select("body").append("p").text("Number of cities: " + numEu);
  // Activity 3.5
  function stringtoInt(column) {
    for (var i = 0; i < numEu; i++) {
      filteredData[i][column] = +filteredData[i][column];
    }
  }
  stringtoInt("population");
  stringtoInt("x");
  stringtoInt("y");
  // Activity 3.6 and 3.7
  var svgContainer = d3.select("body").append("svg")
                       .attr("width", 700)
                       .attr("height", 550);

  svgContainer.selectAll("circle")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("fill", "#86abff")
    .attr("r", function(d) {
                 if (d.population < 1000000){
                   return 4;
                 }
                 else {
                   return 8;
                 }
               })
    .attr("cx", function(d) {
                  return d.x;
                })
    .attr("cy", function(d) {
                  return d.y;
                });

  svgContainer.selectAll("text")
    .data(filteredData)
    .enter()
    .append("text")
    .attr("x", function(d) {
                 return d.x;
               })
    .attr("y", function(d) {
                 return (d.y - 12);
               })
    .attr("opacity", function(d) {
                       if (d.population < 1000000) {
                         return 0;
                       }
                       else {
                         return 1;
                       }
                     })
    .text(function(d) {
            return d.city;
          })
    .attr("class", "city-label");
});

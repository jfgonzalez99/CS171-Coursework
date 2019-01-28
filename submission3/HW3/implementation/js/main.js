/* main JS file */
d3.csv("data/buildings.csv", function(data) {
  console.log(data);

  // Convert number values
  var numBuildings = data.length;

  function stringtoInt(column) {
    for (var i = 0; i < numBuildings; i++) {
      data[i][column] = +data[i][column];
    }
  }
  stringtoInt("height_px");
  stringtoInt("height_m");
  stringtoInt("height_ft");

  // Sort in descending order
  var sortedData = data.sort(function(a, b) {
                     return b.height_ft - a.height_ft;
                   });

  // Create SVG canvases
  var svgChart = d3.select("#chart").append("svg")
                   .attr("width", 530)
                   .attr("height", 500);

  // Create function which updates the right half of the page
  var divInfo = document.getElementById("info");

  function updateInfo(selected) {
    divInfo.innerHTML = "<h2>" + selected.building + "</h2>" +
                        "<div class='row'>" +
                        "<img src='img/" + selected.image + "'>" +
                        "<table>" +
                        "<tr><th>Height</th><td>" + selected.height_m + "</td></tr>" +
                        "<tr><th>City</th><td>" + selected.city + "</td></tr>" +
                        "<tr><th>Country</th><td>" + selected.country + "</td></tr>" +
                        "<tr><th>Floors</th><td>" + selected.floors + "</td></tr>" +
                        "<tr><th>Completed</th><td>" + selected.completed + "</td></tr>" +
                        "</table></div>";
  }
  updateInfo(data[0]);

  // Draw rectangles
  svgChart.selectAll("rect.bar")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("fill", "#8372A9")
    .attr("height", 33)
    .attr("width", function (d) {
                     return d.height_px;
                   })
    .attr("x", 245)
    .attr("y", function(d,index){
                 return (index * 41);
               })
    .attr("class", "bar")
    // Update info on click
    .on("click", function(d){
      var selectedImage = data.filter(function(e){
                           return (e.image == d.image);
                         });
      updateInfo(selectedImage[0]);
    });

  // Draw building labels
  svgChart.selectAll("text.name")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("x", 240)
    .attr("y", function(d,index){
                 return (index * 41 + 22);
               })
    .text(function(d) {
            return d.building;
          })
    .attr("class", "name")
    // Update info on click
    .on("click", function(d){
      var selectedImage = data.filter(function(e){
                           return (e.image == d.image);
                         });
      updateInfo(selectedImage[0]);
    });

  // Draw height labels
  svgChart.selectAll("text.height-m")
    .data(sortedData)
    .enter()
    .append("text")
    .attr("x", function (d) {
                 return (d.height_px + 210);
               })
    .attr("y", function(d,index){
                 return (index * 41 + 22);
               })
    .text(function(d) {
            return d.height_m;
          })
    .attr("class", "height-m");
});

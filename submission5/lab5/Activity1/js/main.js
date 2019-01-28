
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'
var margin = {top:20,bottom:20,left:10,right:10};

var height = 240 - margin.top - margin.bottom,
    width = 620 - margin.left - margin.right;

var svg = d3.select("body")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
              .attr("width", width)
              .attr("height", height)
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function updateVisualization(orders) {
	console.log(orders);

  var numOrders = orders.length;

  var circle = g.selectAll("circle")
                .data(orders);

  var text = g.selectAll("text")
              .data(orders);

  circle.enter()
        .append("circle")
        .attr("r", 20)
        .merge(circle)
        .attr("fill", function(d) {
                        if (d.product == "coffee") {
                          return "#384A59";
                        }
                        else {
                          return "#F25764";
                        }
                      })
        .attr("cx", function(d, i) { return i * 50 + 105; })
        .attr("cy", (height / 2));

  text.enter()
      .append("text")
      .attr("y", (height / 2 + 5))
      .attr("class", "order-label")
      .merge(text)
      .text("Orders: " + numOrders);

  circle.exit().remove();
  text.exit().remove();
}

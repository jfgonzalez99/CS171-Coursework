
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// Load data
d3.json("data/airports.json", function(data) {

  console.log(data);
  console.log(data.nodes[(data.links[0].source) - 1].latitude);

  // 1) INITIALIZE FORCE-LAYOUT
  // 2a) DEFINE 'NODES' AND 'EDGES'
  // 2b) START RUNNING THE SIMULATION
  // 3) DRAW THE LINKS (SVG LINE)
  // 4) DRAW THE NODES (SVG CIRCLE)
  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

  var links = data.links;
  var nodes = data.nodes;

  var linkDistance = 40;
  var chargeStrength = -8;



  var force = d3.forceSimulation(nodes)
   			.force("charge", d3.forceManyBody().strength(chargeStrength))
    		.force("link", d3.forceLink(links).distance(linkDistance))
    		.force("center", d3.forceCenter().x(width/2).y(height/2));
  

  var edge = svg.selectAll(".edge")
          .data(links)
          .enter().append("line")
              .attr("class", "edge")
              .attr("stroke-width", 2)
              .attr("stroke", "lightgrey");

  var node = svg.selectAll(".node")
          .data(nodes)
        	.enter().append("circle")
          		.attr("class", "node")
          		.attr("r", 5)
          		.attr("fill", function(d) {
                if (d.country == "United States") {
                  return "blue";
                }
                else {
                  return "red";
                }
              });

  node.append("title")
   .text(function(d) { return d.name; });

  force.on("tick", function() {

    // Update node coordinates
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    edge.attr("x1", function(d) {
                      return d.source.x;
                    })
        .attr("x2", function(d) {
                      return d.target.x;
                    })
        .attr("y1", function(d) {
                      return d.source.y;
                    })
        .attr("y2", function(d) {
                      return d.target.y;
                    });

  });

  // Make nodes draggable
  // https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048

  function dragSubject() {
    return force.find(d3.event.x, d3.event.y);
  }

  node.call(d3.drag()
    .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

  function dragStarted() {

    if (!d3.event.active) {
      force.alphaTarget(0.3).restart();
    }

    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;

  }

  function dragging(d) {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragEnded() {

    node.classed("dragging", false);

    if (!d3.event.active) {
      force.alphaTarget(0);
    }

    d3.event.subject.fx = null;
    d3.event.subject.fy = null;

  }

  function drawLink(d) {
    edge.moveTo(d.source.x, d.source.y);
    edge.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d) {
    node.moveTo(d.x + 3, d.y);
    node.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }
});

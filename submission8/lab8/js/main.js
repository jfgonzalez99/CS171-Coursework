
var margin = {top: 100, right: 10, bottom: 20, left: 100},
    width = 960 - margin.left - margin.right,
    height = 920 - margin.top - margin.bottom;

var svg = d3.select('#chart-area').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);


var matrix = {
  "marriage" : [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
  "business" : [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
};

var familyData;
var data = [];

// Used to sum all elements in array
function add(a, b) {
    return a + b;
}

// Load data
d3.queue()
    .defer(d3.csv, 'data/florentine-familiy-attributes.csv')
    .defer(d3.csv, 'data/marriage-matrix.csv')
    .defer(d3.csv, 'data/business-matrix.csv')
    .await(function(error, data1, data2, data3) {

      familyData = data1;

      // Wrangle data
      for (var i = 0; i < 16; i++) {
        var familyElement = {
      		"index": null,
      		"name": null,
      		"allRelations": null,
      		"businessTies": null,
      		"businessValues": null,
      		"marriages": null,
      		"marriageValues": null,
      		"numberPriorates": null,
      		"wealth": null
      	}

        for (var j = 0; j < 16; j++) {
          matrix.marriage[i].push(+data2[i][j]);
          matrix.business[i].push(+data3[i][j]);
        }

        familyElement.index = i;
        familyElement.name = familyData[i]["Family"];
        familyElement.businessTies = (matrix.business[i]).reduce(add, 0);
        familyElement.businessValues = matrix.business[i];
        familyElement.marriages = matrix.marriage[i].reduce(add, 0);
        familyElement.marriageValues = matrix.marriage[i];
        familyElement.allRelations = familyElement.businessTies + familyElement.marriages;
        familyElement.numberPriorates = +familyData[i]["Priorates"];
        familyElement.wealth = +familyData[i]["Wealth"];
        data.push(familyElement);
      }

      console.log(data);

      svg.selectAll(".column-label")
        .data(familyData).enter()
        .append("text")
          .attr('class', 'column-label')
          .attr('transform', function(d,i) {
            return 'rotate(-90) translate(' + (-margin.top) + ',' + (i * 30 + margin.left + 25) + ')';
          })
          .text(function(d) {
            return d.Family;
          });

      console.log(familyData);
      console.log(matrix.marriage);
      console.log(matrix.business);

      updateVisualization();

    });

// Draw viz
function updateVisualization() {

  var j;

  var selection = document.getElementById("selection").value;
  console.log(selection);
  
  var matrixArea = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var cellHeight = 20, cellWidth = 20, cellPadding = 10;

  for (var i = 0; i < 16; i++) {
    j = -1;
    // matrixArea.selectAll('.row' + i)
    //     .data(matrix.marriage)
    //     .enter()
    //     .append('rect')
    //       .attr('class', 'matrix row' + i)
    //       .attr('x', function(d,index) {
    //         return index * 30 + 10;
    //       })
    //       .attr('y', function() {
    //         return i * 30 + 10;
    //       })
    //       .attr('width', 20)
    //       .attr('height', 20)
    //       .style('fill', function() {
    //         j++
    //         if (matrix.marriage[i][j] == 1) {
    //           return '#EB6896';
    //         }
    //         else {
    //           return 'lightgrey';
    //         }
    //       });
    // D3's enter, update, exit pattern
    var upperTrianglePath = matrixArea.selectAll(".upper-row" + i)
    	.data(matrix.marriage);

    upperTrianglePath.enter().append("path")
    	.attr("class", "upper-row" + i )
      .attr("d", function(d, index) {
        // Shift the triangles on the x-axis (columns)
        var x = (cellWidth + cellPadding) * index + 10;

        // All triangles of the same row have the same y-coordinates
        // Vertical shifting is already done by transforming the group elements
        var y = i * 30 + 10;

        return 'M ' + x +' '+ y + ' l ' + cellWidth + ' 0 l 0 ' + cellHeight + ' z';
      })
      .attr('fill', function() {
              j++
              if (matrix.marriage[i][j] == 1) {
                return '#EB6896';
              }
              else {
                return 'lightgrey';
              }
            });

    var lowerTrianglePath = matrixArea.selectAll(".lower-row" + i)
    	.data(matrix.business);

    j = -1;

    lowerTrianglePath.enter().append("path")
    	.attr("class", "lower-row" + i )
      .attr("d", function(d, index) {
        // Shift the triangles on the x-axis (columns)
        var x = (cellWidth + cellPadding) * index + 10;

        // All triangles of the same row have the same y-coordinates
        // Vertical shifting is already done by transforming the group elements
        var y = i * 30 + 10;

        return 'M ' + x +' '+ y + ' l 0 ' + cellHeight + ' l ' + cellWidth + ' 0 z';
      })
      .attr('fill', function() {
              j++
              if (matrix.business[i][j] == 1) {
                return '#0F6A8B';
              }
              else {
                return 'lightgrey';
              }
            });
  }

  svg.selectAll(".row-label")
    .data(familyData).enter()
    .append("text")
      .attr('class', 'row-label')
      .attr('y', function(d,i) {
        return i * 30 + margin.top + 25;
      })
      .text(function(d) {
        return d.Family;
      });

}

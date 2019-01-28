
// Bar chart configurations: data keys and chart titles
var configs = [
	{ key: "ownrent", title: "Own or Rent" },
	{ key: "electricity", title: "Electricity" },
	{ key: "latrine", title: "Latrine" },
	{ key: "hohreligion", title: "Religion" }
];

// Initialize variables to save the charts later
var barcharts = [];
var areachart;


// Date parser to convert strings to date objects
var parseDate = d3.timeParse("%Y-%m-%d");


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new area chart object

d3.csv("data/household_characteristics.csv", function(data){

  barcharts = data;

  barcharts.forEach(function(d){
    d.survey = parseDate(d.survey);
  });

  console.log(barcharts);

  function nest(category) {
    return d3.nest()
             .key(function(d) { return d[category]; })
             .rollup(function(leaves) { return leaves.length; })
             .entries(barcharts);
  }


  rentCount = nest("ownrent");
  electricityCount = nest("electricity");
  latrineCount = nest("latrine");
  religionCount = nest("hohreligion");
  dateCount = nest("survey");

  console.log(rentCount);
  console.log(electricityCount);
  console.log(latrineCount);
  console.log(religionCount);


  dateCount.forEach(function(d){
    d.key = parseDate(d.key);
  });
  console.log(dateCount);

  rentChart = new BarChart("rent", barcharts, "ownrent");
  electricityChart = new BarChart("electricity", barcharts, "electricity");
  latrineChart = new BarChart("latrine", barcharts, "latrine");
  religionChart = new BarChart("religion", barcharts, "hohreligion");
  areachart = new AreaChart("areachart", dateCount);

});


// React to 'brushed' event and update all bar charts
function brushed() {

  // Get the extent of the current brush
	var selectionRange = d3.brushSelection(d3.select(".brush").node());
  console.log(selectionRange);

	// Convert the extent into the corresponding domain values
	var selectionDomain = selectionRange.map(areachart.x.invert);
  console.log(selectionDomain);

  rentChart.selectionChanged(selectionDomain);
  electricityChart.selectionChanged(selectionDomain);
  latrineChart.selectionChanged(selectionDomain);
  religionChart.selectionChanged(selectionDomain);

}

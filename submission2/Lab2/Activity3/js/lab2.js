
// Global variable with 60 attractions (JSON format)
console.log(attractionData);

dataManipulation();

function dataManipulation() {
  var selectBox = document.getElementById("attraction-category");
  var selectedValue = (selectBox.options[selectBox.selectedIndex].value);
  dataFiltering(selectedValue);
}

function dataFiltering(selectedCategory) {
  var attractions = attractionData;
  console.log(selectedCategory);

  // Filter first by desired category
  var filteredCategory =
    attractions.filter(function(value, index) {
                         if (selectedCategory == "all") {
                           return (value.Category == "Theme Park") ||
                           (value.Category == "Water Park") ||
                           (value.Category == "Museum");
                         }
                         else {
                           return (value.Category == selectedCategory);
                         }
                       });

  filteredCategory
  console.log(filteredCategory);

  // Sort filtered list of attractions
  var sortedAttractions =
    filteredCategory.sort(function(a, b) {
                       return b.Visitors - a.Visitors;
                     });

  sortedAttractions
  console.log(sortedAttractions);

  // Filter attractions again for 5 most visited
  var data =
    sortedAttractions.filter(function(value, index) {
                 	             return (index < 5);
                             });

  data
  console.log(data);

	renderBarChart(data);
}

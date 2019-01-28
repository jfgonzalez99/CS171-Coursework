

// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);

dataManipulation();
createVisualization("all","all");


// Obtain selection values
function dataManipulation() {
  var selectBox1 = document.getElementById("area");
  var selectedValue1 = (selectBox1.options[selectBox1.selectedIndex].value);
  console.log(selectedValue1);
  var selectBox2 = document.getElementById("order-type");
  var selectedValue2 = (selectBox2.options[selectBox2.selectedIndex].value);
  console.log(selectedValue2);
  createVisualization(selectedValue1, selectedValue2);
}


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART
function createVisualization(selectedValue1, selectedValue2) {
  var deliveries = deliveryData;
  var feedback = feedbackData;

  // Filter deliveries by area
  var filteredArea =
    deliveries.filter(function(value){
                        if (selectedValue1 == "all") {
                          return (value.area == "Boston") ||
                                 (value.area == "Cambridge") ||
                                 (value.area == "Somerville");
                        }
                        else {
                          return (value.area == selectedValue1);
                        }
                      });
  filteredArea
  console.log(filteredArea);

  // Filter deliveries by method
  var filteredMethod =
    filteredArea.filter(function(value){
                        if (selectedValue2 == "all") {
                          return (value.order_type == "phone") ||
                                 (value.order_type == "web");
                        }
                        else {
                          return (value.order_type == selectedValue2);
                        }
                      });

  var filteredDeliveries = filteredMethod;
  filteredDeliveries
  console.log(filteredDeliveries);

  // Number of deliveries
  var numberDeliveries = filteredDeliveries.length;
  console.log("Number of deliveries: " + numberDeliveries);

  // Filter feedback entries
  var tempFeedback = [];

  function filterFeeback() {
    for (var i = 0; i < numberDeliveries; i++) {
      for (var j = 0; j < feedback.length; j++) {
        if (filteredDeliveries[i].delivery_id == feedback[j].delivery_id) {
          tempFeedback.push(feedback[j])
        }
      }
    }
  }

  filterFeeback();
  console.log(tempFeedback);

  // Counting function
  function countOf(metric) {
    var total = 0;
    for (var i = 0; i < numberDeliveries; i++) {
      total += filteredDeliveries[i][metric];
    }
    return (total);
  }

  // Number of pizzas
  var numberPizzas = countOf("count");
  console.log("Number of pizzas: " + numberPizzas);

  // Average time
  var averageTime = countOf("delivery_time") / numberDeliveries;
  var roundedTime = Math.round(averageTime * 100) / 100;
  console.log("Average delivery time: " + averageTime);

  // Total sales
  var sales = countOf("price");
  var roundedSales = Math.round(sales * 100) / 100;
  console.log("Total sales: $" + sales);

  // Feedback
  var numberFeedback = tempFeedback.length;
  console.log("Total feedback entries: " + numberFeedback);

  function feedbackCounter() {
    var lowTotal = 0;
    var midTotal = 0;
    var highTotal = 0;

    for (var i = 0; i < numberFeedback; i++) {
      var quality = tempFeedback[i].quality;
      if (quality == "low") {
        lowTotal += 1;
      } else if (quality == "medium") {
        midTotal += 1;
      } else {
        highTotal += 1;
      }
    }

    return ([lowTotal, midTotal, highTotal]);
  }

  var lowFeedback = feedbackCounter()[0];
  var midFeedback = feedbackCounter()[1];
  var highFeedback = feedbackCounter()[2];

  console.log("Quality:\n Low: " + lowFeedback +
              "\n Medium: " + midFeedback +
              "\n High: " + highFeedback);

  // Display results
  function displayResults(id, result) {
    document.getElementById(id).innerHTML = result;
  }

  displayResults("deliveries", numberDeliveries);
  displayResults("pizzas", numberPizzas);
  displayResults("average-time", roundedTime);
  displayResults("sales", roundedSales);
  displayResults("feedback", numberFeedback);
  displayResults("high-quality", highFeedback);
  displayResults("mid-quality", midFeedback);
  displayResults("low-quality", lowFeedback);

  // Display bar chart
  renderBarChart(filteredDeliveries);

	/* ************************************************************
	 *
	 * ADD YOUR CODE HERE
	 * (accordingly to the instructions in the HW2 assignment)
	 *
	 * 1) Filter data
	 * 2) Display key figures
	 * 3) Display bar chart
	 * 4) React to user input and start with (1)
	 *
	 * ************************************************************/

}

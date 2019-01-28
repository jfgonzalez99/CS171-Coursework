// Activity 1.3
var attractions = [
    {
        id: "Roller Coaster",
        name: "Lickity Split",
        price: 5,
        daysOpen: ["Sunday","Monday","Tuesday","Wednesday","Thursday",
                   "Friday","Saturday"],
        restrictions: true
    },
    {
        id: "Playground",
        name: "Bunches of Fun",
        price: 3,
        daysOpen: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
        restrictions: false
    },
    {
        id: "Water Ride",
        name: "Slippery Peel",
        price: 6,
        daysOpen: ["Sunday","Friday","Saturday"],
        restrictions: false
    }
];

// Activity 1.4
console.log(attractions[0].name);

console.log(attractions[1].daysOpen);

console.log(attractions[1].daysOpen[0]);

console.log(attractions[2].price / 2);

// Activity 2.1 and 2.2
function doublePrices(attractions) {
  for (var i = 0; i < attractions.length; i++) {
    if (i % 2 == 0) {
      attractions[i].price = attractions[i].price * 2;
    }
  }
}

var amusementRidesDouble = doublePrices(attractions);
console.log(amusementRidesDouble);

// Activity 2.3
function debugAmusementRides(attractions) {
  for (var i = 0; i < attractions.length; i++) {
    console.log(attractions[i].name + ": " + attractions[i].price);
  }
}

debugAmusementRides(attractions);

// Activity 2.4
function displayAmusementRides(attractions) {
  for (var i = 0; i < attractions.length; i++) {
    // https://www.w3schools.com/jsref/met_node_appendchild.asp
    var node = document.createElement("LI");
    var textnode = document.createTextNode(attractions[i].name + ": " + attractions[i].price);
    node.appendChild(textnode);
    document.getElementById("pricing").appendChild(node);
  }
}

displayAmusementRides(attractions);

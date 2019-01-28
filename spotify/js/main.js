// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.setRequestHeader(header, value);

request.open('GET', 'https://api.spotify.com/v1/audio-features/06AKEBrKUckW0KREUWRnvT', true);


request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    data.forEach(movie => {
      console.log(movie.title);
    });
  } else {
    console.log('error');
  }
}


// Send request
request.send();

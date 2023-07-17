// Global variables and requests
var apiPdex = "";
var pkmonList = "";
getPdex();

// Functions
function showContent() {
  var boton = document.getElementById("startButton");
  boton.style.display = "none"; // Show start button

  var content = document.getElementById("content");
  content.style.display = "block"; // Show page content
}

function getPdex() {
  fetch("https://my-poke-api.onrender.com/")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      apiPdex = data;
      pkmonList = data.map(function (jsonObj) {
        return jsonObj.name;
      });
    })
}

// Event Listeners
document.getElementById("autocomplete-input").addEventListener("input", function () {
  var input = this.value;
  var resultsDiv = document.getElementById("autocomplete-results");
  resultsDiv.innerHTML = "";

  if (input.length > 0) {
    var matchingPkmons = apiPdex.filter(function (pokemon) {
      return pokemon.name.toLowerCase().startsWith(input.toLowerCase());
    });
    matchingPkmons.forEach(pokemon => {
      var div = document.createElement("div");

      var img = document.createElement("img");
      img.src = "data:image/png;base64," + pokemon.image; // Decode image
      div.appendChild(img);

      var p = document.createElement("p");
      p.textContent = pokemon.name;
      div.appendChild(p);

      resultsDiv.appendChild(div);
    });
  }
})


// TAB INDEX ???
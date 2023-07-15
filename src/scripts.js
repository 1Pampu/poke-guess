// Global variables and requests
var apiRandom = "";
var apiPdex = "";
var pkmonList = "";
newRandom();
getPdex();

// Functions
function showContent() {
  var boton = document.getElementById("startButton");
  boton.style.display = "none"; // Show start button

  var content = document.getElementById("content");
  content.style.display = "block"; // Show page content
}

function newRandom() {
  fetch("https://my-poke-api.onrender.com/random")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      apiRandom = data;
    })
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
    var matchingPkmons = pkmonList.filter(function (pokemon) {
      return pokemon.toLowerCase().startsWith(input.toLowerCase());
    });
    matchingPkmons.forEach(pokemon => {
      var p = document.createElement("p");
      p.textContent = pokemon;
      resultsDiv.appendChild(p);
    })
  }
})


// // Evento que se activa cuando el contenido del campo de texto cambia
// document.getElementById("autocomplete-input").addEventListener("input", function () {
//   var resultsDiv = document.getElementById("autocomplete-results")
//   var inputText = this.value; // Actual value in the box
//   resultsDiv.innerHTML = ""  // Remove previus results

//   // Send Request
//    fetch("https://my-poke-api.onrender.com/pokemon/?name=" + inputText)
//   //fetch("http://127.0.0.1:8000/pokemon/?name=" + inputText)
//     .then(function (response) {
//       if (response.ok) {
//         return response.json();
//       }
//       else {
//         throw new Error("Pokemon not Found!");
//       }
//     })
//     .then(function (data) {
//       data.forEach(pokemon => {
//         var p = document.createElement("p");
//         p.textContent = pokemon["name"];
//         resultsDiv.appendChild(p);
//       });
//     })
//     .catch(function (error) {
//       console.log("Error:", error);
//     });
// })

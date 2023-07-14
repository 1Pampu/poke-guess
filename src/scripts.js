var apiResponse = ""

function mostrarContenido() {
  var boton = document.getElementById("startButton");
  boton.style.display = "none"; // Show start button

  var contenido = document.getElementById("content");
  contenido.style.display = "block"; // Show page content

  // Send Request
  fetch("https://my-poke-api.onrender.com/random")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      apiResponse = data
    })
}

// Evento que se activa cuando el contenido del campo de texto cambia
document.getElementById("autocomplete-input").addEventListener("input", function () {
  var resultsDiv = document.getElementById("autocomplete-results")
  var inputText = this.value; // Actual value in the box

  // Send Request
  fetch("https://my-poke-api.onrender.com/pokemon/?name=" + inputText)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error in the API request", response.status);
      }
    })
    .then(function (data) {
      data.forEach(pokemon => {
        var p = document.createElement("p");
        p.textContent = pokemon["name"];
        resultsDiv.appendChild(p);
      });
    })
});

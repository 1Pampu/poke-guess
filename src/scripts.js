// Global variables and requests
var apiPdex = "";
var pkmonList = "";
getPdex();

// Functions
function getPdex() {
  // This function make the request to the api and stores the data
  fetch("https://my-poke-api.onrender.com/")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Show page once the client have the data
      document.getElementById('loading-spinner').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      apiPdex = data;
      pkmonList = data.map(function (jsonObj) {
        return jsonObj.name;
      });
    })
}

function updateAnchorEventListeners() {
  // This function update the event listener from the autocomplete anchors when it's called
  var anchors = document.querySelectorAll('.pokemonAnchor');
  // Remove Existing event Listeners
  anchors.forEach(anchor => {
    anchor.removeEventListener('click', handleClick);
  });
  // Add new and updated event Listeners
  anchors.forEach(anchor => {
    anchor.addEventListener('click', handleClick);
  });
}

function handleClick() {
  // This function is in charge of coping the anchor p text and paste it in the input when clicked / called
  var input = document.getElementById('autocomplete-input');
  var texto = this.querySelector('.pokeDiv > p').innerText;
  var resultsDiv = document.getElementById("autocomplete-results");
  input.value = texto;  // Set the new value
  resultsDiv.innerHTML = "";  // Erase the anchors
}

function capitalize(text) {
  // This function works as in python, capitilezes the string
  return text.replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}

function pdexNumberInput() {
  // This function checks the value in the input and returns the pdex number if it's a valid pokemon, if it's not returns a null
  var input = document.getElementById('autocomplete-input');
  var isInList = pkmonList.map(function (str) {
    return str.toLowerCase();
  }).includes(input.value.toLowerCase());

  if (isInList) {
    var pkmonDictionary = apiPdex.find(function (dic) {
      return dic.name === capitalize(input.value);
    });
    var pkdexNumber = pkmonDictionary.pokedex_number;
    return pkdexNumber
  }
  else {
    return null
  }
}

function getPokemonDictionary(pokedexNumber, apiPdex) {
  for (let i = 0; i < apiPdex.length; i++) {
    if (apiPdex[i].pokedex_number === pokedexNumber) {
      return apiPdex[i];
    }
  }
}

function postRequest() {
  // Function to submit the post request to the server
  pNum = pdexNumberInput();
  if (pNum != null) {
    var data = { "pokedex_number": pdexNumberInput() }
    fetch("https://my-poke-api.onrender.com/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data); // print json in console
        var pokemon = getPokemonDictionary(pNum, apiPdex);
        var divContainer = document.createElement("div");

        // Pokemon Image
        var divImage = document.createElement("div");
        divImage.classList.add("box");
        var img = document.createElement("img");
        img.src = "data:image/png;base64," + pokemon.image; // Decode image
        divImage.appendChild(img);
        divContainer.appendChild(divImage);

        // Pokedex Number
        var divPkdexnumber = document.createElement("div");
        divPkdexnumber.classList.add("box", data.pokedex_number);
        var pPkdexnumber = document.createElement("p");
        pPkdexnumber.textContent = pokemon.pokedex_number;
        divPkdexnumber.appendChild(pPkdexnumber);
        divContainer.appendChild(divPkdexnumber);

        // Type 1
        var divType1 = document.createElement("div");
        divType1.classList.add("box", data.type1);
        var pType1 = document.createElement("p");
        pType1.textContent = pokemon.type1;
        divType1.appendChild(pType1);
        divContainer.appendChild(divType1);

        // Type 2
        var divType2 = document.createElement("div");
        divType2.classList.add("box", data.type2);
        var pType2 = document.createElement("p");
        pType2.textContent = pokemon.type2;
        divType2.appendChild(pType2);
        divContainer.appendChild(divType2);

        // Height
        var divHeight = document.createElement("div");
        divHeight.classList.add("box",data.height_m);
        var pHeight = document.createElement("p");
        pHeight.textContent = pokemon.height_m + "m";
        divHeight.appendChild(pHeight);
        divContainer.appendChild(divHeight);

        // Weight
        var divWeight = document.createElement("div");
        divWeight.classList.add("box",data.weight_kg);
        var pWeight = document.createElement("p");
        pWeight.textContent = pokemon.weight_kg + "Kg";
        divWeight.appendChild(pWeight);
        divContainer.appendChild(divWeight);

        // Legendary
        var divLegendary = document.createElement("div");
        divLegendary.classList.add("box",data.is_legendary);
        var pLegendary = document.createElement("p");
        if (pokemon.is_legendary == 0){pLegendary.textContent = "No"}
        else{pLegendary.textContent = "Yes"}
        divLegendary.appendChild(pLegendary);
        divContainer.appendChild(divLegendary);

        // Append all
        var answersDiv = document.getElementById("answers");
        answersDiv.appendChild(divContainer);
      })
  }
  else {
    // implement adding a p with a warning like "That's not a valid pokemon"
  }
}

// Event Listeners
document.getElementById("autocomplete-input").addEventListener("input", function () {
  // This event Listener updates the pokemon list when it register a change in the input
  var input = this.value;
  var resultsDiv = document.getElementById("autocomplete-results");
  resultsDiv.innerHTML = "";

  if (input.length > 0) {
    var matchingPkmons = apiPdex.filter(function (pokemon) {
      return pokemon.name.toLowerCase().startsWith(input.toLowerCase());
    });
    matchingPkmons.forEach(pokemon => {
      var anchor = document.createElement("anchor");
      anchor.classList.add('pokemonAnchor');

      var div = document.createElement("div");
      div.classList.add("pokeDiv")

      var img = document.createElement("img");
      img.src = "data:image/png;base64," + pokemon.image; // Decode image
      div.appendChild(img);

      var p = document.createElement("p");
      p.textContent = pokemon.name;
      div.appendChild(p);

      anchor.appendChild(div);
      resultsDiv.appendChild(anchor);
      updateAnchorEventListeners();
    });
  }
})

document.getElementById("submitBtn").addEventListener('click', postRequest)
document.getElementById("autocomplete-input").addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    var resultsDiv = document.getElementById("autocomplete-results");
    resultsDiv.innerHTML = "";
    postRequest();
  }
})
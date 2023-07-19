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
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function pdexNumberInput() {
  // This function checks the value in the input and returns the pdex number if it's a valid pokemon, if it's not returns a null
  var input = document.getElementById('autocomplete-input');
  var isInList = pkmonList.map(function(str){
    return str.toLowerCase();
  }).includes(input.value.toLowerCase());

  if (isInList){
    var pkmonDictionary = apiPdex.find(function(dic) {
      return dic.name === capitalize(input.value);
  });
    var pkdexNumber = pkmonDictionary.pokedex_number;
    return pkdexNumber
  }
  else{
    return null
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
      updateAnchorEventListeners()
    });
  }
})

document.getElementById("submitBtn").addEventListener('click', function(){
  pNum = pdexNumberInput();
  if (pNum != null){
    var data = {"pokedex_number":pdexNumberInput()}
    fetch("https://my-poke-api.onrender.com/answer",{method: "POST", headers:{"Content-Type":"application/json"},body: JSON.stringify(data)})
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data); // print json in console
    })
  }
  else{
    // implement adding a p with a warning like "That's not a valid pokemon"
  }
})



// TAB INDEX ???
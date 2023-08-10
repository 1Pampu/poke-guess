// Global variables and requests
var apiPdex = "";
var pkmonList = "";
var lastPokemon = "";
var tries = 0;
var wins = parseInt(localStorage.getItem("wins")) || 0;
getLastPokemon()
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

function getLastPokemon() {
  // This function make a request to the server and gets the previus answer
  fetch("https://my-poke-api.onrender.com/lastGuess")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lastPokemon = data.pokemon
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
  // This function returns the pokemon dictionary, needs a pokedes number and de list of dictionaries
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
    var pokemon = getPokemonDictionary(pNum, apiPdex);
    if (pkmonList.includes(pokemon.name))
      var data = { "pokedex_number": pdexNumberInput() }
    fetch("https://my-poke-api.onrender.com/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var divContainer = document.createElement("div");
        divContainer.classList.add("my-answer");

        var checkList = []

        // Pokemon Image
        var divImage = document.createElement("div");
        divImage.classList.add("box", "answer");
        divImage.style.animationDelay = "0s";
        var img = document.createElement("img");
        img.src = "data:image/png;base64," + pokemon.image; // Decode image
        img.title = pokemon.name;
        divImage.appendChild(img);
        divContainer.appendChild(divImage);

        // Pokedex Number
        var divPkdexnumber = document.createElement("div");
        divPkdexnumber.classList.add("box", data.pokedex_number, "answer");
        divPkdexnumber.style.animationDelay = "0.5s";
        var pPkdexnumber = document.createElement("p");
        pPkdexnumber.textContent = pokemon.pokedex_number;
        divPkdexnumber.appendChild(pPkdexnumber);
        divContainer.appendChild(divPkdexnumber);
        checkList.push(data.pokedex_number);

        // Type 1
        var divType1 = document.createElement("div");
        divType1.classList.add("box", data.type1, "answer");
        divType1.style.animationDelay = "1s";
        var pType1 = document.createElement("p");
        pType1.textContent = capitalize(pokemon.type1);
        divType1.appendChild(pType1);
        divContainer.appendChild(divType1);
        checkList.push(data.type1);

        // Type 2
        var divType2 = document.createElement("div");
        divType2.classList.add("box", data.type2, "answer");
        divType2.style.animationDelay = "1.5s";
        var pType2 = document.createElement("p");
        pType2.textContent = capitalize(pokemon.type2);
        divType2.appendChild(pType2);
        divContainer.appendChild(divType2);
        checkList.push(data.type2);

        // Height
        var divHeight = document.createElement("div");
        divHeight.classList.add("box", data.height_m, "answer");
        divHeight.style.animationDelay = "2s";
        var pHeight = document.createElement("p");
        pHeight.textContent = pokemon.height_m + "m";
        divHeight.appendChild(pHeight);
        divContainer.appendChild(divHeight);
        checkList.push(data.height_m);

        // Weight
        var divWeight = document.createElement("div");
        divWeight.classList.add("box", data.weight_kg, "answer");
        divWeight.style.animationDelay = "2.5s";
        var pWeight = document.createElement("p");
        pWeight.textContent = pokemon.weight_kg + "Kg";
        divWeight.appendChild(pWeight);
        divContainer.appendChild(divWeight);
        checkList.push(data.weight_kg);

        // Legendary
        var divLegendary = document.createElement("div");
        divLegendary.classList.add("box", data.is_legendary, "answer");
        divLegendary.style.animationDelay = "3s";
        var pLegendary = document.createElement("p");
        if (pokemon.is_legendary == 0) { pLegendary.textContent = "No" }
        else { pLegendary.textContent = "Yes" }
        divLegendary.appendChild(pLegendary);
        divContainer.appendChild(divLegendary);
        checkList.push(data.is_legendary);

        // Append all
        var answersDiv = document.getElementById("answers");
        // answersDiv.appendChild(divContainer);
        var firstChild = answersDiv.firstElementChild;
        answersDiv.insertBefore(divContainer, firstChild.nextSibling)

        // Remove input
        var input = document.getElementById("autocomplete-input");
        input.value = "";

        // Remove pokemon from list & dictionary
        var index = pkmonList.indexOf(pokemon.name);
        pkmonList.splice(index, 1);
        index = apiPdex.findIndex(item => item.name === pokemon.name);
        apiPdex.splice(index, 1);

        // Add an attemp to the counter
        tries++;

        isWinner(checkList,pokemon);
      })
  }
}

function isWinner(list,pokemon) {
  // this function checks if the list of answers are all true in that case is the correct answer
  var allTrue = true;
  for (var i = 0; i < list.length; i++) {
    if (list[i] !== true) {
      allTrue = false;
      break;
    }
  }
  if (allTrue) { // This is the winner
    var input = document.getElementById("autocomplete-input");
    input.disabled = true;
    wins++;
    localStorage.setItem("wins", wins);
    showWinnerMessage(pokemon);
  }
}

function showWinnerMessage(pokemon) {
  // This function Activates the winner popout after 3.75 seconds
  var message = document.getElementById("winner-message");
  setTimeout(function () {
    message.style.display = "block";
  }, 3750);

  var imgWinner = document.getElementById("winnerImg");
  imgWinner.src = "data:image/png;base64," + pokemon.image;
  var winnerName = document.getElementById("winnerName");
  winnerName.textContent = pokemon.name;
  var winnerNum = document.getElementById("winnerNum");
  winnerNum.textContent += pokemon.pokedex_number;
  var winnerH = document.getElementById("winnerH");
  winnerH.textContent = pokemon.height_m + "m"
  var winnerW = document.getElementById("winnerW");
  winnerW.textContent = pokemon.weight_kg + "Kg"
  var winnerT1 = document.getElementById("winnerT1");
  winnerT1.textContent = capitalize(pokemon.type1)
  var winnerT2 = document.getElementById("winnerT2");
  winnerT2.textContent = capitalize(pokemon.type2)

  // Stats
  var pWins = document.getElementById("wins");
  pWins.textContent = wins;
  var pLastP = document.getElementById("lastPokemon");
  pLastP.textContent = lastPokemon;
  var pTries = document.getElementById("tries");
  pTries.textContent = tries;

  // This part makes the blur
  var container = document.getElementById("container");
  container.classList.add("blur");
}

function closePopup() {
  // This function closes the winner popout
  document.getElementById("winner-message").style.display = 'none';
  document.getElementById("container").classList.remove("blur");
}

function countDown(timeRemaining) {
  // This function updates the timer
  var timerElement = document.getElementById("timer");
  var winnerPopTimer = document.getElementById("timer-popout");

  var loop = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(loop);
      timerElement.innerHTML = "Reloading Page!"
      winnerPopTimer.innerHTML = "0:00"
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      var minutes = Math.floor(timeRemaining / 60);
      var seconds = Math.floor(timeRemaining % 60);
      timerElement.innerHTML = `Next Pokemon in ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      winnerPopTimer.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }
    timeRemaining--;
  }, 1000);
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
// Event listener triggered when clicking the send button

document.getElementById("autocomplete-input").addEventListener("keyup", function (event) {
  // Event listener triggered when pressing enter in the input
  if (event.keyCode === 13) {
    var resultsDiv = document.getElementById("autocomplete-results");
    resultsDiv.innerHTML = "";
    postRequest();
  }
})

document.addEventListener("DOMContentLoaded", () => {
  // Event listener that runs when the page is loaded
  fetch("https://my-poke-api.onrender.com/time")
    .then(response => response.json())
    .then(data => {
      // Get Actual time in UTC
      const nowUtc = new Date();
      // Get the str that the server returns
      const serverTimeStr = data.nextPokemon;

      // Extract compenents to create te Date time
      const year = parseInt(serverTimeStr.slice(0, 4));
      const month = parseInt(serverTimeStr.slice(5, 7)) - 1;
      const day = parseInt(serverTimeStr.slice(8, 10));
      const hour = parseInt(serverTimeStr.slice(11, 13));
      const minute = parseInt(serverTimeStr.slice(14, 16));
      const second = parseInt(serverTimeStr.slice(17, 19));

      // Create UTC time
      const serverTime = new Date(Date.UTC(year, month, day, hour, minute, second));

      // Time to new pokemon
      const timeDifferenceMs = serverTime - nowUtc;

      // Difference in seconds
      const timeDifferenceSeconds = timeDifferenceMs / 1000;
      countDown(timeDifferenceSeconds);
    })
});

// TODO: Win count
var owmKeyElisa = config.OWM_KEY_E;
var owmKeyFabi = config.OWM_KEY_F;



//##################################################################################

// ###################################
// Elisas Funktionen
// ###################################

// read json from Open Waether Map
// https://bithacker.dev/fetch-weather-openweathermap-api-javascript
// set the OWM data
function setOwmData(d) {
  function celsius(x) {
    return Math.round(parseFloat(x) - 273.15);
  }
  function fahrenheit(x) {
    return Math.round((parseFloat(x) - 273.15) * 1.8 + 32);
  }
  function windDirection(x) {
    if (x == 0) {
      return "Nord";
    } else if (x > 0 && x <= 90) {
      return "Nordost";
    } else if (x == 90) {
      return "Ost";
    } else if (x > 90 && x <= 180) {
      return "Südost";
    } else if (x == 180) {
      return "Süd";
    } else if (x > 180 && x <= 270) {
      return "Südwest";
    } else if (x == 270) {
      return "West";
    } else if (x > 270 && x <= 360) {
      return "Nordwest";
    }
  }
  //document.getElementById("weatherIcon").innerHTML = "<h2>" + celsius(d.main.temp)  + '&deg;' + "</h2>";
  document.getElementById("weatherIcon").innerHTML =
    "<img src='http://openweathermap.org/img/wn/" +
    d.weather[0].icon +
    ".png' alt='icon weather'>" +
    "<span>" +
    celsius(d.main.temp) +
    "&deg;" +
    "</span>";

  document.getElementById("temp").innerHTML = celsius(d.main.temp) + "&deg;";
  document.getElementById("temp_min").innerHTML =
    celsius(d.main.temp_min) + "&deg;";
  document.getElementById("temp_max").innerHTML =
    celsius(d.main.temp_max) + "&deg;";
  document.getElementById("clouds").innerHTML =
    d.clouds.all + " % / " + d.weather[0].description;
  document.getElementById("deg").innerHTML = windDirection(d.wind.deg);
  document.getElementById("speed").innerHTML = d.wind.speed + " m/s";
  document.getElementById("humidity").innerHTML = d.main.humidity + " %";
  document.getElementById("pressure").innerHTML = d.main.pressure + " hpa";
}


// get the OWM data
function getOwmJSON(latitude, longitude) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      owmKeyElisa
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      console.log(data);
      setOwmData(data); // Call drawWeather
    })
    .catch(function () {
      alert(
        "Eine Abfrage aller Wetterdaten ist zur Zeit leider nicht möglich."
      );
    });
}

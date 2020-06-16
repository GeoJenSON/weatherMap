function weatherBalloon(cityID) {
  var key = "ff610c629bba10b0a578163a8322dd9b";
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityID +
      "&appid=" +
      key
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      drawWeather(data);
      console.log(data);
    })
    .catch(function () {
      // catch any errors
    });
}

function drawWeather(d) {
  var celcius = Math.round(parseFloat(d.main.temp) - 273.15);
  var fahrenheit = Math.round((parseFloat(d.main.temp) - 273.15) * 1.8 + 32);
  var description = d.weather[0].description;
  var iconCode = d.weather[0].icon;
  console.log(iconCode);

  document.getElementById("description").innerHTML = description;
  document.getElementById("temp").innerHTML = celcius + "&deg;";
  document.getElementById("location").innerHTML = d.name;
  document.getElementById("icon").src = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

  if (description.indexOf("rain") >= 0) {
    document.body.className = "rainy";
  } else if (description.indexOf("cloud") >= 0) {
    document.body.className = "cloudy";
  } else if (description.indexOf("clear sky") >= 0) {
    document.body.className = "sunny";
  }
}

window.onload = function () {
  weatherBalloon("Berlin");
};

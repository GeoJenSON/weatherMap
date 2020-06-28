var mapboxKey = config.MAPBOX_KEY;
var owmKey = config.OWM_KEY;

//##################################################################################


// read json from Open Waether Map
// https://bithacker.dev/fetch-weather-openweathermap-api-javascript
// set the OWM data

function celsius(x){
  return Math.round(parseFloat(x)-273.15);
}

function fahrenheit(x){
  return Math.round(((parseFloat(x)-273.15)*1.8)+32); 
}

function windDirection(x){
  if(x == 0){
    return "nord";
  }
  else if(x > 0 && x <= 90){
    return "nordost";
  }
  else if(x == 90){
    return "ost";
  }
  else if(x > 90 && x <= 180){
    return "südost";
  }
  else if(x == 180){
    return "süd";
  }
  else if(x > 180 && x <= 270){
    return "südwest";
  }
  else if(x == 270){
    return "west";
  }
  else if(x > 270 && x <= 360){
    return "nordwest";
  }
}

var labels = [];
var dataSet = [];

function createDiagramm(){
  console.log("start function createDiagramm()");

  Highcharts.chart('diagramm', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Vorhersage der Lufttemperatur für 5 Tage/ 3 Stunden'
    },
    subtitle: {
        text: 'Source: openweathermap.org'
    },
    xAxis: {
        categories: labels
    },
    yAxis: {
        title: {
            text: 'Temperature (°C)'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name: 'Lufttemperatur',
        data: dataSet
    }]
});
}

function setOwmForecastData(data){
  labels = []; // set the Array empty
  dataSet = []; // set the Array empty
  var i;
  for (i = 0; i < data.list.length; i++) {
      dataSet.push(celsius(data.list[i].main.temp));
      labels.push(data.list[i].dt_txt);
  }
  
  console.log(dataSet);
  console.log(labels);

  createDiagramm();
}

function setCurrentOwmData(d) {
  // Read json from openweathermap.org
  // https://bithacker.dev/fetch-weather-openweathermap-api-javascript
  document.getElementById("weatherIcon").innerHTML = 
      "<img src='http://openweathermap.org/img/wn/" + d.weather[0].icon + ".png' alt='icon weather'>"
      + "<span>" + celsius(d.main.temp)  + '&deg;' + "</span>";

  document.getElementById('temp').innerHTML = celsius(d.main.temp) + '&deg;';
  document.getElementById('temp_min').innerHTML = celsius(d.main.temp_min) + '&deg;';
  document.getElementById('temp_max').innerHTML = celsius(d.main.temp_max) + '&deg;';
  document.getElementById('clouds').innerHTML = d.clouds.all + " %; " + d.weather[0].description;
  document.getElementById('deg').innerHTML = windDirection(d.wind.deg);
  document.getElementById('speed').innerHTML = d.wind.speed + " m/s";
  document.getElementById('humidity').innerHTML = d.main.humidity + " %";
  document.getElementById('pressure').innerHTML = d.main.pressure + " hpa";

};

function setForecastOwmData(d) {
  console.log(JSON.stringify(d));
  document.getElementById('diagramm').style.display = 'block';

 setOwmForecastData(d);
};


function getOwmJSON(lat,lon,type) {
  // current weather: https://api.openweathermap.org/data/2.5/weather?
  // Forecast: https://api.openweathermap.org/data/2.5/forecast?
  var currentURL = "https://api.openweathermap.org/data/2.5/weather?";
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
  var url;

  if(type == "current"){
      url = currentURL;
  }else if(type == "forecast"){
      url = forecastURL;
  }else{
      console.log("Die Funktion getOwmJSON(lat,lon,type) benötigt den Parameter 'type' - mit dem Wert 'current' oder 'forecast'.");
  }
  
  fetch(url + "lat=" + lat +"&lon=" + lon + "&appid=" + owmKey)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
      
      if(type== "current"){
          console.log(data);
          setCurrentOwmData(data);
      }else if(type == "forecast"){
          console.log(data);
          setForecastOwmData(data);
      }
  })
  // .catch(function() {
  //     alert("Eine Abfrage der Wetterdaten ist zur Zeit leider nicht möglich.");
  // });
};
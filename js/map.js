var mapboxKey = config.MAPBOX_KEY;
var mapboxStyle = config.MAPBOX_STYLE;
var owmKeyFabi = config.OWM_KEY_F;
var owmKeyElisa = config.OWM_KEY_E;

$(document).ready(function () {

  // function to draw cities depending on the OWM data
  function drawCities(data) {
    for (var i = 0; i < data.list.length; i++) {
      var celsius = Math.round(parseFloat(data.list[i].main.temp));
      var lng = data.list[i].coord.Lon;
      var lat = data.list[i].coord.Lat;
      var cityName = data.list[i].name;
      var iconCode = data.list[i].weather[0].icon;

      var cityMarker = document.createElement("div");
      cityMarker.className = "city-marker";
      cityMarker.style.backgroundImage = "url('http://openweathermap.org/img/wn/" + iconCode + "@2x.png')";
      new mapboxgl.Marker(cityMarker)
        .setLngLat({ lng: lng, lat: lat })
        .addTo(map);

      var cityTemp = document.createElement("div");
      cityTemp.className = "city-temp";
      cityTemp.innerHTML = celsius + "°C";
      new mapboxgl.Marker(cityTemp)
        .setLngLat({ lng: lng, lat: lat })
        .addTo(map);
    }
  }

  // function to load the OWM data for the cities
  function loadCities(zoomlevel) {
    // first call for the southwest bbox
    fetch(
      "http://api.openweathermap.org/data/2.5/box/city?bbox=5.9,47,10,51," +
        zoomlevel +
        "&appid=" +
        owmKeyFabi
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        drawCities(data);
      })
      .catch(function () {
        // catch any errors
      });

    // second call for the southeast bbox
    fetch(
      "http://api.openweathermap.org/data/2.5/box/city?bbox=10.01,47,15.10,51," +
        zoomlevel +
        "&appid=" +
        owmKeyFabi
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        drawCities(data);
      })
      .catch(function () {
        // catch any errors
      });

    // third call for the northeast bbox
    fetch(
      "http://api.openweathermap.org/data/2.5/box/city?bbox=10.01,51,15.10,55," +
        zoomlevel +
        "&appid=" +
        owmKeyFabi
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        drawCities(data);
      })
      .catch(function () {
        // catch any errors
      });

    // fourth call for the northwest bbox
    fetch(
      "http://api.openweathermap.org/data/2.5/box/city?bbox=5,51,10,55," +
        zoomlevel +
        "&appid=" +
        owmKeyFabi
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        drawCities(data);
      })
      .catch(function () {
        // catch any errors
      });
  }

  var map = new mapboxgl.Map({
    accessToken: mapboxKey,
    container: "map", // container id
    style: mapboxStyle, //
    center: [10.5, 51.2], // starting position [lng, lat]
    zoom: 5, // starting zoom
    minZoom: 4,
    maxZoom: 7,
  });

  // MapBox GL Geocoder
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxKey,
    mapboxgl: mapboxgl,
  });

  document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

  // Listen for the `result` event from the Geocoder
  // `result` event is triggered when a user makes a selection
  // Get the coordinates of the result
  geocoder.on("result", function (ev) {
    console.log(ev.result.place_name);
    console.log(ev.result);
    console.log(ev.result.geometry.coordinates);
    console.log(ev.result.geometry.coordinates[0]);

    var latitude = ev.result.geometry.coordinates[1];
    var longitude = ev.result.geometry.coordinates[0];
    var place_name = ev.result.place_name;

    document.getElementById("place_name").innerHTML = place_name;
    document.getElementById("latitude").innerHTML = latitude.toString().replace(".", ",") + "°";
    document.getElementById("longitude").innerHTML = longitude.toString().replace(".", ",") + "°";

    getOwmJSON(latitude, longitude);
  });
  /* Add Parameter layer on map */
  map.on("load", function () {
    // add layer for temperature
    map.addLayer({
      id: "Lufttemperatur",
      type: "raster",
      source: {
        type: "raster",
        tiles: [
          "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=" +
            owmKeyElisa,
        ],
        tileSize: 256,
      },
      layout: {
        visibility: "none",
      },
      minzoom: 0,
      maxzoom: 22,
    });

    // add layer for clouds
    map.addLayer({
      id: "Wolkenbedeckung",
      type: "raster",
      source: {
        type: "raster",
        tiles: [
          "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=" +
            owmKeyElisa,
        ],
        tileSize: 256,
      },
      layout: {
        visibility: "none",
      },
      minzoom: 0,
      maxzoom: 22,
    });

    // add layer for precipitation
    map.addLayer({
      id: "Niederschlag",
      type: "raster",
      source: {
        type: "raster",
        tiles: [
          "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=" +
            owmKeyElisa,
        ],
        tileSize: 256,
      },
      layout: {
        visibility: "none",
      },
      minzoom: 0,
      maxzoom: 22,
    });

    // add layer for wind speed
    map.addLayer({
      id: "Windgeschwindigkeit",
      type: "raster",
      source: {
        type: "raster",
        tiles: [
          "https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=" +
            owmKeyElisa,
        ],
        tileSize: 256,
      },
      layout: {
        visibility: "none",
      },
      minzoom: 0,
      maxzoom: 22,
    });

    // add layer for sea level pressure
    map.addLayer({
      id: "Luftdruck",
      type: "raster",
      source: {
        type: "raster",
        tiles: [
          "https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=" +
            owmKeyElisa,
        ],
        tileSize: 256,
      },
      layout: {
        visibility: "none",
      },
      minzoom: 0,
      maxzoom: 22,
    });

    // Call function to get data for the cities and draw the icons 
    loadCities(5);
  });

  // make sure all markers are displayed correctly in each zoom level
  map.on("zoomend", function () {
    var zoom = map.getZoom();
    var zoomlevel;

    if (zoom < 5) {
      zoomlevel = 5;
      document.querySelectorAll(".city-marker").forEach(function (div) {
        div.remove();
      });
      document.querySelectorAll(".city-temp").forEach(function (div) {
        div.remove();
      });
      loadCities(zoomlevel);
    } else if (zoom >= 5 && zoom < 6) {
      zoomlevel = 6;
      document.querySelectorAll(".city-marker").forEach(function (div) {
        div.remove();
      });
      document.querySelectorAll(".city-temp").forEach(function (div) {
        div.remove();
      });
      loadCities(zoomlevel);
    } else if (zoom >= 6) {
      zoomlevel = 7;
      document.querySelectorAll(".city-marker").forEach(function (div) {
        div.remove();
      });
      document.querySelectorAll(".city-temp").forEach(function (div) {
        div.remove();
      });
      loadCities(zoomlevel);
    }
  });

  // Add Layer switcher 
  var menu = document.getElementById("menu");
  var inputs = menu.getElementsByTagName("input");

  var currentClickedLayerId = ""; // ID of the actuel clicked layer input button
  var lastClickedLayerId = ""; // ID of the last clicked layer input button

  var currentClickedInput = document.getElementById(currentClickedLayerId);
  var lastClickedInput = document.getElementById(lastClickedLayerId);

  var buttonElement;

  //this function needs to stay here in this file to access the Mapbox GL Map object, which is unknown in the function.js file
  function switchLayer(layer) {
    console.log("----- new switch -----");
    currentClickedLayerId = layer.target.id;

    console.log("var currentClickedLayerId = '" + currentClickedLayerId + "'");
    console.log("var lastClickedLayerId = '" + lastClickedLayerId + "'");

    if (lastClickedLayerId !== currentClickedLayerId) {
      // if first time a layer is clicked
      console.log("-->  layer is clicked");
      if (lastClickedLayerId !== "") {
        map.setLayoutProperty(lastClickedLayerId, "visibility", "none");
        document.getElementById("legend" + lastClickedLayerId).style.display =
          "none"; // remove legend
        buttonElement = document.getElementById(lastClickedLayerId);
        buttonElement.classList.remove("buttonActive");
      }
      console.log(map);
      map.setLayoutProperty(currentClickedLayerId, "visibility", "visible");
      document.getElementById("legend" + currentClickedLayerId).style.display =
        "block"; // set legend
      buttonElement = document.getElementById(currentClickedLayerId);
      buttonElement.classList.add("buttonActive");
      lastClickedLayerId = currentClickedLayerId; // set the current layer as last layer
    } else {
      // if same layer is clicked
      console.log("--> same layer is clicked");
      map.setLayoutProperty(currentClickedLayerId, "visibility", "none");
      document.getElementById("legend" + currentClickedLayerId).style.display =
        "none"; // remove legend
      buttonElement = document.getElementById(currentClickedLayerId);
      buttonElement.classList.remove("buttonActive");
      lastClickedLayerId = "";
      currentClickedLayerId = "";
    }
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
    console.log("still no layer is clicked");
  }
});

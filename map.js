var mapboxKey = config.MAPBOX_KEY;
var mapboxStyle = config.MAPBOX_STYLE;
var owmKey = config.OWM_KEY;

// function to load the OWM data for the cities
function loadCities(zoomlevel) {
  // first call for the southwest bbox
  fetch(
    "http://api.openweathermap.org/data/2.5/box/city?bbox=5.9,47,10,51," +
      zoomlevel +
      "&appid=" +
      owmKey
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
      owmKey
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
      owmKey
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
      owmKey
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

// function to draw cities depending on the OWM data
function drawCities(data) {
  for (var i = 0; i < data.list.length; i++) {
    var celsius = Math.round(parseFloat(data.list[i].main.temp));
    var lng = data.list[i].coord.Lon;
    var lat = data.list[i].coord.Lat;
    var cityName = data.list[i].name;
    var iconCode = data.list[i].weather[0].icon;

    var cityMarker = document.createElement("div");
    cityMarker.className = "city-marker"
    cityMarker.style.backgroundImage = "url('http://openweathermap.org/img/wn/" + iconCode + "@2x.png')"
    new mapboxgl.Marker(cityMarker).setLngLat({ lng: lng, lat: lat }).addTo(map);

    var cityTemp = document.createElement("div");
    cityTemp.className = "city-temp";
    cityTemp.innerHTML = celsius + "°C";
    new mapboxgl.Marker(cityTemp).setLngLat({lng: lng, lat: lat}).addTo(map);

  }

}

// load the Mapbox map
mapboxgl.accessToken = mapboxKey; // access token
var map = new mapboxgl.Map({
  container: "map",
  style: mapboxStyle, // style URL
  center: [10, 51], //exactly the opposite order of mapbox studio (long, lat)
  zoom: 5.5,
  maxZoom: 7,
  minZoom: 4,
});

// add the Geodcoder
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: "de-DE",
    mapboxgl: mapboxgl,
  })
);

map.on("load", function () {
  //--------------------------------------
  // adding all the weather layers
  //--------------------------------------

  // temperature
  map.addLayer({
    id: "Lufttemperatur",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    layout: {
      visibility: "none",
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // clouds
  map.addLayer({
    id: "Wolkenbedeckung",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    layout: {
      visibility: "none",
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // precipitation
  map.addLayer({
    id: "Niederschlag",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    layout: {
      visibility: "none",
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // wind speed
  map.addLayer({
    id: "Windgeschwindigkeit",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    layout: {
      visibility: "none",
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // sea level pressure
  map.addLayer({
    id: "Luftdruck",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    layout: {
      visibility: "none",
    },
    minzoom: 0,
    maxzoom: 22,
  });

  loadCities(5);
});

map.on("zoomend", function () {

  var zoom = map.getZoom();
  var zoomlevel;


  if (zoom < 5) {
    zoomlevel = 5;
    document.querySelectorAll('.city-marker').forEach(function(div) {
      div.remove()
    })
    document.querySelectorAll('.city-temp').forEach(function(div) {
      div.remove()
    })
    loadCities(zoomlevel);
  } 
  else if (zoom >= 5 && zoom < 6) {
    zoomlevel = 6;
    document.querySelectorAll('.city-marker').forEach(function(div) {
      div.remove()
    })
    document.querySelectorAll('.city-temp').forEach(function(div) {
      div.remove()
    })
    loadCities(zoomlevel);
  } 
  else if (zoom >= 6) {
    zoomlevel = 7;
    document.querySelectorAll('.city-marker').forEach(function(div) {
      div.remove()
    })
    document.querySelectorAll('.city-temp').forEach(function(div) {
      div.remove()
    })
    loadCities(zoomlevel);
  }

});

//enumerate ids of the layers
var toggleableLayerIds = [
  "Lufttemperatur",
  "Wolkenbedeckung",
  "Niederschlag",
  "Windgeschwindigkeit",
  "Luftdruck",
];

// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];
  var link = document.createElement("a");
  link.href = "#";
  link.className = "";
  link.textContent = id;

  link.onclick = function (e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(clickedLayer, "visibility");

    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === "visible") {
      map.setLayoutProperty(clickedLayer, "visibility", "none");
      this.className = "";
    } else {
      this.className = "active";
      map.setLayoutProperty(clickedLayer, "visibility", "visible");
    }
  };

  var layers = document.getElementById("menu");
  layers.appendChild(link);
}

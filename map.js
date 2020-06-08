var mapboxKey = config.MAPBOX_KEY;
var mapboxStyle = config.MAPBOX_STYLE;
var owmKey = config.OWM_KEY;

mapboxgl.accessToken = mapboxKey; // access token
var map = new mapboxgl.Map({
  container: "map",
  style: mapboxStyle, // style URL
  center: [15, 51], //exactly the opposite order of mapbox studio (long, lat)
  zoom: 4,
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    language: "de-DE",
    mapboxgl: mapboxgl
  })
);

map.on("load", function () {
  // add layer for temperature
  map.addLayer({
    id: "temperature",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // add layer for clouds
  map.addLayer({
    id: "cloud",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // add layer for precipitation
  map.addLayer({
    id: "precipitation",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // add layer for wind speed
  map.addLayer({
    id: "wind",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    minzoom: 0,
    maxzoom: 22,
  });

  // add layer for sea level pressure
  map.addLayer({
    id: "pressure",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=" +
          owmKey,
      ],
      tileSize: 256,
    },
    minzoom: 0,
    maxzoom: 22,
  });
});

//enumerate ids of the layers
var toggleableLayerIds = [
  "temperature",
  "cloud",
  "precipitation",
  "wind",
  "pressure",
];

// set up the corresponding toggle button for each layer
for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];

  var link = document.createElement("a");
  link.href = "#";
  link.className = "active";
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

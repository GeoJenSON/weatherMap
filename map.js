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

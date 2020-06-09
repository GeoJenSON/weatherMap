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
  var tempValues = [
    "&nbsp; &nbsp; -40",
    "&nbsp; &nbsp; -30",
    "&nbsp; &nbsp; -20",
    "&nbsp; &nbsp; -10",
    "&nbsp; &nbsp; &nbsp; 0",
    "&nbsp; &nbsp; +10",
    "&nbsp; &nbsp; +20",
    "&nbsp; &nbsp; +25",
    "&nbsp; &nbsp; +30",
  ];
  var tempColors = [
    "rgba(130, 22, 146, 1)",
    "rgba(130, 87, 219, 1)",
    "rgba(32, 140, 236, 1)",
    "rgba(32, 196, 232, 1)",
    "rgba(35, 221, 221, 1)",
    "rgba(194, 255, 40, 1)",
    "rgba(255, 240, 40, 1)",
    "rgba(255, 194, 40, 1)",
    "rgba(252, 128, 20, 1)",
  ];

  for (i = 0; i < tempValues.length; i++) {
    var layer = tempValues[i];
    var color = tempColors[i];
    var item = document.createElement("div");
    var key = document.createElement("span");
    key.className = "legend-key";
    key.style.backgroundColor = color;

    var value = document.createElement("span");
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }

  // add layer for temperature
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

  // add layer for clouds
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

  // add layer for precipitation
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

  // add layer for wind speed
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

  // add layer for sea level pressure
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
  "Lufttemperatur" ,
  "Wolkenbedeckung",
  "Niederschlag",
  "Windgeschwindigkeit",
  "Luftdruck"
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

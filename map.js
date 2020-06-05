var mapboxKey = config.MAPBOX_KEY;
var mapboxStyle = config.MAPBOX_STYLE;
var owmKey = config.OWM_KEY;




mapboxgl.accessToken = mapboxKey; // access token
    var map = new mapboxgl.Map({
      container: 'map',
      style: mapboxStyle, // style URL
      center: [15, 51], //exactly the opposite order of mapbox studio (long, lat)
      zoom: 4
    });

    map.on('load', function () {
      map.addLayer({
        "id": "temp-tiles",
        "type": "raster",
        "source": {
          "type": "raster",
          "tiles": ["https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=" + owmKey], 
          "tileSize": 256
        },
        "minzoom": 0,
        "maxzoom": 22
      });
    });
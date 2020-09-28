// Server
// sudo apt-get install python-netcdf4 


function initDemoMap() {
  var Esri_WorldImagery = L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, " +
        "AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );

  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
      "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
      "{z}/{x}/{y}.png",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, " +
        "NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
    }
  );


  var Relief = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: '',
    subdomains: 'abcd',
      minZoom: 3,
    maxZoom: 13,
    ext: 'png'
  }
  );

  var baseLayers = {
    Satellite: Esri_WorldImagery,
    "Grey Canvas": Esri_DarkGreyCanvas,
    "Relief" : Relief
  };

  var map = L.map("map", {
    layers: [Esri_DarkGreyCanvas]
  });

  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([43, 12], 8);

  return {
    map: map,
    layerControl: layerControl
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

// load data (u, v grids) from somewhere (e.g. http://52.204.147.213/latest)
//$.getJSON("http://52.204.147.213/latest", function(data) {
$.getJSON("1400-wind-surface-level-gfs-1.0.json", function(data) {
  alert("caricato");
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Wind",
      displayPosition: "bottomleft",
      displayEmptyString: "No wind data",
      speedUnit: "k/h"
    },
    data: data,
    maxVelocity: 8,
    lineWidth: 2,
    particleAge: 90,
    velocityScale: 0.02,
    }).addTo(map);

  //layerControl.addOverlay(velocityLayer, "Wind - Great Barrier Reef");
});

// $.getJSON("water-gbr.json", function(data) {
//   var velocityLayer = L.velocityLayer({
//     displayValues: true,
//     displayOptions: {
//       velocityType: "GBR Water",
//       displayPosition: "bottomleft",
//       displayEmptyString: "No water data"
//     },
//     data: data,
//     maxVelocity: 0.6,
//     velocityScale: 0.1 // arbitrary default 0.005
//   });

//   layerControl.addOverlay(velocityLayer, "Ocean Current - Great Barrier Reef");
// });

// $.getJSON("wind-global.json", function(data) {
//   var velocityLayer = L.velocityLayer({
//     displayValues: true,
//     displayOptions: {
//       velocityType: "Global Wind",
//       displayPosition: "bottomleft",
//       displayEmptyString: "No wind data"
//     },
//     data: data,
//     maxVelocity: 15
//   });

//   layerControl.addOverlay(velocityLayer, "Wind - Global");
// });

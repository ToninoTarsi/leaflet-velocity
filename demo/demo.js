// Server
// sudo apt-get install python-netcdf4 





var Esri_WorldImagery = L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: ""
    }
);

var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
    "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
    "{z}/{x}/{y}.png", {
        attribution: ""
    }
);


var Relief = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: '',
    subdomains: 'abcd',
    minZoom: 3,
    maxZoom: 13,
    ext: 'png'
});

var Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
    attribution: '',
    maxZoom: 13
});


var baseLayers = {
    Satellite: Esri_WorldImagery,
    "Solo confini": Esri_DarkGreyCanvas,
    "Rilievi": Relief,
    "Rilievi grigio": Esri_WorldShadedRelief,
};

var map = L.map("map", {
    layers: [Esri_WorldImagery],
});

var layerControl = L.control.layers(baseLayers);
layerControl.addTo(map);
map.setView([43.357222, 12.749444], 11);
var southWest = L.latLng(42.3, 12.0);
var northEast = L.latLng(43.7, 13.8);
var bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);



document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';

for (let i = 1; i < 10; i++) {
    var circle = L.circle([43.357222, 12.749444], {
        color: "black",
        fill: false,
        weight: 2,
        dashArray: "5, 5",
        opacity: 1.0,
        radius: i * 10000
    }).addTo(map);
}

var circleCucco = L.circleMarker([43.357222, 12.749444], {
    color: "black",
    opacity: 1,
    radius: 3,
    title: "Cucco"
}).addTo(map);
circleCucco.bindPopup("Cucco");


var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
        velocityType: "Velocity",
        displayPosition: "bottomleft",
        displayEmptyString: "Nessun dato",
        speedUnit: "k/h"
    },
    maxVelocity: 8,
    lineWidth: 2,
    particleAge: 90,
    velocityScale: 0.02,
}).addTo(map);

function loadData(data) {
    var obj = JSON.parse(data)
    velocityLayer.setData(obj);
}

var updateInfo = function(pos) {
    info = velocityLayer.updateInfo(pos);
    var el = document.getElementsByClassName("leaflet-control-velocity");
    el[0].innerHTML = info
}

var iconSize = 32;
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [iconSize, iconSize],
        shadowSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
        shadowAnchor: [iconSize / 2, iconSize / 2],
        popupAnchor: [iconSize / 2, iconSize / 2]
    }
});
var starIcon = new LeafIcon({
    iconUrl: 'images/star.png',
})
var marker = new L.Marker([43.357222, 12.749444], { icon: starIcon }).addTo(map);
//marker.setLatLng(new L.LatLng(43.357222, 12.749444));

var popLocation = undefined;




map.on('mousedown', function(e) {
    pressTimer = window.setTimeout(function() {
    popLocation = e.latlng;
    marker.setLatLng(popLocation);
    updateInfo(popLocation);
    //console.log('something')
    },500);  
});
  
  map.on('mouseup', function() {
    clearTimeout(pressTimer);
  });


// map.on('click', function(e) {
//     popLocation = e.latlng;
//     marker.setLatLng(popLocation);
//     updateInfo(popLocation);
//     console.log('something');
// });

// load data (u, v grids) from somewhere (e.g. http://52.204.147.213/latest)
//$.getJSON("wind-gbr.json", function(data) {
$.getJSON("1400-wind-surface-level-gfs-1.0.json", function(data) {
    //alert(data);
    velocityLayer.setData(data);
    if (marker.getLatLng() == undefined) {
        marker.setLatLng(new L.LatLng(43.357222, 12.749444));
        updateInfo(new L.LatLng(43.357222, 12.749444));
    } else {
        updateInfo(marker.getLatLng());
    }

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
// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
let streetmap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> contributors'
});

// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [20, 0],
  zoom: 2,
  layers: [basemap]
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
let earthquakeLayer = L.layerGroup();
let tectonicPlatesLayer = L.layerGroup();

let baseMaps = {
  "Street Map": streetmap,
  "Base Map": basemap
};

let overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

// Add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function (feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[1]),
        color: "#000005",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 1.0
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h3>Magnitude: " + feature.properties.mag + "</h3>" +
        "<h3>Depth: " + feature.geometry.coordinates[2] + " km</h3>" +
        "<p>Location: " + feature.properties.place + "</p>"
      );
    }
  }).addTo(map);

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {

  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    return depth > 90 ? "#ff0000" :
           depth > 70 ? "#ff6600" :
           depth > 50 ? "#ffcc00" :
           depth > 30 ? "#ccff33" :
           depth > 10 ? "#66ff66" : "#00ff00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {

    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

  // Create a legend control object.
  // Initialize depth intervals and colors for the legend
  // Loop through our depth intervals to generate a label with a colored square for each interval.
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        colors = ["#00ff00", "#66ff66", "#ccff33", "#ffcc00", "#ff6600", "#ff0000"];

    div.innerHTML += "<h4>Depth (km)</h4>";
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML += '<i style="background: ' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;
  };

   // Finally, add the legend to the map.
   
  legend.addTo(map);
});

 


  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    L.geoJson(plate_data, {
      style: {
        color: "orange",
        weight: 2
      }
    }).addTo(tectonicPlatesLayer);
  
    tectonicPlatesLayer.addTo(map);
  });

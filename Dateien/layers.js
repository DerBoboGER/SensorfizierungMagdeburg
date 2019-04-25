function addLayerSatellite (mapid) {
  mapid.addSource("mapbox-satellite", {
    "type": "raster",
    "url": "mapbox://mapbox.satellite",
    "tileSize": 256
  });
  mapid.addLayer({
    "type": "raster",
    "id": 'Satellitenansicht',
    "source": "mapbox-satellite",
    "layout":{
      "visibility": "none"
    }
  });
}

function addLayerSensoren (mapid) {
  mapid.addSource("markierungen", {
    "type": "geojson",
    "data":{
    "type": "FeatureCollection",
    "features": Luftdaten
    }
  });
  mapid.addLayer({ //Eigenschaften der markierungen
    "id": "Sensoren",
    "type": "circle", //Kreis
    "source": "markierungen", //Quelle geoJSON "markierungen"
    "layout":{
      "visibility": "visible"
    },
      "paint": {
      "circle-radius": 7,
      "circle-stroke-width": 2,
      "circle-stroke-color": "white",
      "circle-color":[
        "case", // Wenn kein property "P1" circle-color blue, ansonsten interpolieren (Grenzwerte PM10)
        ["!",["has", "P1"]],
        "blue",
        [
          "interpolate",
          ["linear"],
          ["get", "P1"],
          0, "green",
          25, "yellow",
          50, "red"
        ]
      ]
    }
  });

}

function addLayerHeatmap10 (mapid) {
  mapid.addLayer({
    "id": "Heatmap PM 10 µg",
    "type": "heatmap",
    "maxzoom": 14,
    "source": "markierungen",
    "layout":{
      "visibility": "none"
    },
    "paint": {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "P1"],
        0, 0,
        50, 1
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 0,
        14, 1
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "hsla(0, 0%, 100%, 0)",
        0.03, "green",
        0.25, "yellow",
        0.33, "red"
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1, 1,
        14, 100
      ],
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 0.1,
        14, 0.9
      ]
    },
    "filter": ["==", "SDS011", true]
  });
}

function addLayerHeatmap2_5 (mapid) {
  mapid.addLayer({
    "id": "Heatmap PM 2,5 µg",
    "type": "heatmap",
    "maxzoom": 14,
    "source": "markierungen",
    "layout":{
      "visibility": "none"
    },
    "paint": {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "P2"],
        0, 0,
        25, 1
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 0,
        14, 1
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "hsla(0, 0%, 100%, 0)",
        0.03, "green",
        0.25, "yellow",
        0.33, "red"
      ],
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1, 1,
        14, 100
      ],
      "heatmap-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 0.1,
        14, 0.9
      ]
    },
    "filter": ["==", "SDS011", true]
  });
}

function addLayerMagdeburg (mapid) {
  mapid.addSource("shape MD", {
    "type": "geojson",
    "data": shapeMD
  });
  /*map.addSource("shape Biederitz", {
    "type": "geojson",
    "data": shapeBiederitz
  });
  */
  mapid.addLayer({
    "id": "Stadtgebiet Magdeburg",
    "type": "fill",
    "source": "shape MD",
    "layout":{
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "rgb(91,94,100)",
      "fill-opacity": 0.25
    }
  });

  mapid.addLayer({
    "id": "Stadtgebietsgrenze Magdeburg",
    "type": "line",
    "source": "shape MD",
    "layout":{
      "visibility": "visible"
    },
    "paint": {
      "line-color": "rgb(204,227,16)",
      "line-width": 2
    }
  });
  /*mapid.addLayer({
    "id": "Gemeinde Biederitz",
    "type": "line",
    "source": "shape Biederitz",
    "paint": {
      "line-color": "#006BB7",
      "line-width": 2
    }
  });
  */

  mapid.addLayer({
    "id": "Stadtgebietsgrenze Magdeburg Satellitenansicht",
    "type": "line",
    "source": "shape MD",
    "layout":{
      "visibility": "none"
    },
    "paint": {
      "line-color": "#ffffff",
      "line-width": 2
    }
  });
  /*mapid.addLayer({
    "id": "Gemeinde Biederitz",
    "type": "line",
    "source": "shape Biederitz",
    "paint": {
      "line-color": "#006BB7",
      "line-width": 2
    }
  });
  */
}

function addLayerDessau_Rosslau (mapid) {
  mapid.addSource("shape Dessau-Rosslau", {
    "type": "geojson",
    "data": shapeDessauRosslau
  });
  mapid.addLayer({
    "id": "Stadtgebiet Dessau-Rosslau",
    "type": "fill",
    "source": "shape Dessau-Rosslau",
    "layout":{
      "visibility": "none"
    },
    "paint": {
      "fill-color": "rgb(91,94,100)",
      "fill-opacity": 0.25
    }
  });
  mapid.addLayer({
    "id": "Stadtgebietsgrenze Dessau-Rosslau",
    "type": "line",
    "source": "shape Dessau-Rosslau",
    "layout":{
      "visibility": "none"
    },
    "paint": {
      "line-color": "rgb(204,227,16)",
      "line-width": 2
    }
  });
}

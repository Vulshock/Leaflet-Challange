var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Fetch request to URL
d3.json(queryUrl, function(data){
    createFeatures(data.features);
    console.log(data.features)
});

function createFeatures(earthquake){
    function eachFeature(feature, layer){
        layer.bindPopup("<h3>"+feature.properties.place+"</h3><hr><p>"+new Date(feature.properties.time)+"</p>");
    }
function radiusSize(magnitude){
    return magnitude * 10000;
}
// build if statement for magnitude colors
function circleColor(magnitude){
    if (magnitude < 1){
        return "#cef542"
    }
    else if (magnitude < 2){
        return "#f0e43c"
    }
    else if (magnitude < 3){
        return "#f0c93c"
    }
    else if (magnitude < 4){
        return "#fa9837"
    }
    else if (magnitude < 5){
        return "#f23f3f"
    }
    else { 
        return "#cef542"
    }
}

var earthquakes = L.geoJSON(earthquake, {
    pointToLayer: function(earthquake, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquake.properties.mag),
        color: circleColor(earthquake.properties.mag),
        fillOpacity: 1
      });
    },
    eachFeature: eachFeature
  });

  // use create Map function to get our info
  createMap(earthquakes);
};
// create map layers in grayscale, outdoors and light
function createMap(earthquakes){
    var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: "pk.eyJ1IjoidnVsc2hvY2siLCJhIjoiY2s5YzNicm53MDB3MjNlczZwOHdxcWk0MSJ9.XNwyd3txLqAclm9ILG7yLA"
      });
      var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1IjoidnVsc2hvY2siLCJhIjoiY2s5YzNicm53MDB3MjNlczZwOHdxcWk0MSJ9.XNwyd3txLqAclm9ILG7yLA"
      });
      var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.grayscale",
        accessToken: "pk.eyJ1IjoidnVsc2hvY2siLCJhIjoiY2s5YzNicm53MDB3MjNlczZwOHdxcWk0MSJ9.XNwyd3txLqAclm9ILG7yLA"
      });
    


      var baseMap={
          "Outdoors Map": outdoor,
          "Light Map": light,
          "Grayscale Map": grayscale,
      };
      
      var overlayMaps = {
        Earthquakes: earthquakes,
      };

      var myMap = L.map("map",{
          center: [
              37.09, -95,65
          ],
          zoom: 3,
          layers: [outdoor, light, grayscale]
      });


      L.control.layers(baseMap, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    
      // color function to be used when creating the legend
      function getColor(d) {
        return d > 5 ? '#f23f3f' :
               d > 4  ? '#fa9837' :
               d > 3  ? '#f0c93c' :
               d > 2  ? '#f0e43c' :
               d > 1  ? 'cef542' :
                        '#cef542';
      }
    
      // Add legend to the map
      var legend = L.control({position: 'bottomright'});
      
      legend.onAdd = function (map) {
      
          var div = L.DomUtil.create('div', 'info legend'),
              mags = [0, 1, 2, 3, 4, 5],
              labels = [];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < mags.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
                  mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
          }
      
          return div;
      };
      
      legend.addTo(myMap);


}
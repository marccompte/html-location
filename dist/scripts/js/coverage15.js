const data = {
  "wireless": {
    "file": "iw_wireless.geojson",
    "label": "wireless",
    "style": {
      strokeColor: '#E9AA00',
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: '#E9AA00',
      fillOpacity: 0.4
    }
  },
  "fiber": {
    "file": "fiber.geojson",
    "label": "fiber",
    "style": {
      strokeColor: '#AA00E9',
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: '#AA00E9',
      fillOpacity: 0.4
    }
  },
  "utopia": {
    "file": "utopia.geojson",
    "label": "Utopia Fiber",
    "style": {
      strokeColor: '#366D96',
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: '#366D96',
      fillOpacity: 0.4
    }
  }
};

var map;

function offsetCenter(latlng, offsetx, offsety) {
    /*
      Move the map the indicated offserx and offsety (in pixels).

      latlng: initial center of the map
      offsetx: displacement on the x axis to the right
      offsety: displacement on the y axis to the top
    */

    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );

    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
    var pixelOffset = new google.maps.Point((offsetx/scale) || 0, (offsety/scale) || 0)

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

    map.setCenter(newCenter);

}

var searchBox = null;
var polygons = [];
var markers = [];

function getData() {
  const bounds = new google.maps.LatLngBounds();
  Object.keys(data).forEach(dataset_id => {
    const dataset = data[dataset_id];
    fetch(dataset.file).then(function(response) {
      return response.json()
    }).then(function(data) {
      const wireless = GeoJSON(data);
      polygons = [...polygons, ...wireless];
      wireless.forEach(function(poly) {
        poly.geojsonProperties["type"] = dataset.label;
        poly.setMap(map);
        poly.setOptions(dataset.style);
        poly.getPath().forEach(function(latlng) {
          bounds.extend(latlng);
        });
      });
      map.fitBounds(bounds);
    });
  });
}

function setMapOptions() {
  map.setOptions({
      draggable: true,
      disableDefaultUI: false
      });

  if (window.innerHeight > 700) {
      map.setOptions( {scrollwheel: true} );
  }
  if (window.screen.availWidth < 650) {
      map.setOptions( {disableDefaultUI: true} );
      $('#map-canvas').height('350');
  }
}


function getAddressComponent(place, type, format) {
  const component = place.address_components.find(function(component) {
    return component.types.includes(type);
  });
  if (typeof component !== "undefined") return component[format];
  else return false;
}


function getPlaceData(place) {
  const marker = new google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location
  });
  const street = getAddressComponent(place, "route", "short_name");
  const number = getAddressComponent(place, "street_number", "short_name");
  var address = street;
  if (number) address = number + ' ' + address;
  const city = getAddressComponent(place, "locality", "long_name");
  const state = getAddressComponent(place, "administrative_area_level_1", "short_name");
  const zip = getAddressComponent(place, "postal_code", "long_name");
  $('#address1').val(address);
  $('#city').val(city);
  $('#state').val(state);
  $('#zip').val(zip);
  // check if there is coverage
  var covered = [];
  polygons.forEach(function(poly) {
    if (google.maps.geometry.poly.containsLocation(place.geometry.location, poly)) {
      covered.push(poly.geojsonProperties.type)
    };
  });
  // show popup
  showPopup(covered, marker);
}

function showPopup(covered, marker) {
  var contentString;
  var contentStringMobile;
  let covered_comma = covered;
  if (covered.length){
    if (covered.length > 1) {
      const last = covered.pop();
      covered_comma = [covered.join(", "), last];
    }
    $('#qualified').val(covered_comma.join(", "));
    contentString = `Congratulations, we have ${covered_comma.join(" and ")} service in your area! Please fill out the form below so we can get in touch with you about starting service.`;
    contentStringMobile = `Congratulations, we have ${covered_comma.join(" and ")} service in your area! <a href='tel:8664636937'>Call now</a> to sign-up or fill out the form below and we'll get in touch with you.`;
  }else{
    contentString = "This address does not appear to be within our coverage area. Please fill out the form below for information about other services we offer in your area.";
    contentStringMobile = "This address does not appear to be within our coverage area. <a href='tel:8664636937'>Call now</a> for info about other services we offer in your area or sign-up below and we'll get in touch with you.";
    $('#qualified').val('Not Qualified');
  }
  var infowindow = new google.maps.InfoWindow({
    content: window.screen.availWidth >650 ? contentString : contentStringMobile,
    maxWidth: '250'
  });
  //input.style.display = 'none';
  infowindow.open(map, marker);
  marker.addListener('click', function() {
    const input = document.getElementById('pac-input');
    infowindow.close();
    input.style.display = 'block';
  });
  document.getElementById('signup-div').style.visibility='visible';
}

function setupSearchBox() {
  // Add the UI
  const input = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP].push(input);
  // Instantiate the search box
  searchBox = new google.maps.places.SearchBox(input);
  // Trigger the search box address selection
  google.maps.event.addListener(searchBox, 'places_changed', function() {
      const places = searchBox.getPlaces();
      if (places.length == 0) {return;}
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      // For each place, get the icon, place name, and location.
      markers = [];
      places.forEach(function(place) {
        if (!("address_components" in place)) {
          const geocoder = new google.maps.Geocoder();
          geocoder
            .geocode({ location: place.geometry.location })
            .then((response) => {
              place.address_components = response.results[0].address_components;
              getPlaceData(place);
              goToPlace(place)
            })
            .catch(function(e) { console.error(e) });
        } else {
          getPlaceData(place);
          goToPlace(place)
        }
      });

      google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
      });
  });
}

function goToPlace(place) {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(place.geometry.location);
  map.fitBounds(bounds);
  map.setZoom(15);
  offsetCenter(map.getCenter(), 0, -100);
}

function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(39.055918, -111.949224)
    );
    map.fitBounds(defaultBounds);

    setMapOptions();
    getData();

    setupSearchBox();

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
};
google.maps.event.addDomListener(window, 'load', initialize);

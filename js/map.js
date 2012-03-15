var m,marker,mainLayer;
var zoom = 8;
var google = this.google;
var center = new google.maps.LatLng(42.04113400940814, -71.795654296875);
var geocoder = new google.maps.Geocoder();
var tid = 3238699;

function fusion() {
  m = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: zoom,
    mapTypeId: "roadmap"
  });
  mainLayer = new google.maps.FusionTablesLayer(tid);
   mainLayer.setQuery("SELECT geometry FROM " + tid);
   mainLayer.setMap(m);
}
function geocode() {
  var address;
  address = document.getElementById("address").value;
  return geocoder.geocode({
    address: address
  }, function(results, status) {
    
    if (status === google.maps.GeocoderStatus.OK) {
      m.setCenter(results[0].geometry.location);
      m.setZoom(14);
      marker = new google.maps.Marker({
        map: m,
        position: results[0].geometry.location
      });
    } else {
      return alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
function resetgeo() {
  m.setCenter(center);
  m.setZoom(zoom);
  marker.setMap(null);
}

$(function() {
  fusion();
  $("#tabs").tabs({
    collapsible: true,
    selected: -1
  });
  $("input:submit,input:reset").button();
  return $("input, textarea").placeholder();
});
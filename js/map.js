var m;
var tid;
var geocoder = new google.maps.Geocoder();
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var marker;
var mainLayer;
var tType;
 $(function() {
        $( "#tabs" ).tabs({
    		collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
        $('input, textarea').placeholder();
        fusion();
        popLists();
      	});

function fusion() {
    tid = document.getElementById("whichMap").value;
  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });

 mainLayer = new google.maps.FusionTablesLayer(tid);
  mainLayer.setQuery("SELECT 'geometry' FROM " + tid);
  mainLayer.setMap(m);
  }

function geocode() {
     var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        m.setCenter(results[0].geometry.location);
        m.setZoom(14);
     marker = new google.maps.Marker({
            map: m, 
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

function resetgeo() {
    
    m.setCenter(center);
    m.setZoom(zoom);
marker.setMap(null);
}

    
    google.load('visualization', '1', {});

function MakePopList(columnName,callfunc){
 var queryText = encodeURIComponent("SELECT " +columnName + ", COUNT() FROM " + tid + " GROUP BY " + columnName);
    var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText);
	query.send(callfunc);
	}
    
    function popLists(){    

MakePopList('TOWN',getTownData);

}

function MakeData(selectID,querryText){

function getData(response) {
  // Get the number of rows
var numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
 var typeSelect = document.getElementById(selectID);  
  for(var i = 0; i < numRows; i++) {
      var ftData = response.getDataTable().getValue(i, 0);
      if (!ftData)
     { continue;}
     else if
     (String(ftData).indexOf(",")>-1)
     {continue;}
     else
     { var newoption = document.createElement('option');
      newoption.setAttribute('value',querryText + "'" + ftData + "'");
    newoption.innerHTML = ftData;
    typeSelect.appendChild(newoption);}
  }  
}
return getData;
}
var getTownData = MakeData("townName", " WHERE TOWN LIKE ");

function changeMap() {
  
  tType = document.getElementById('townName').value.replace("'", "\\'");
  var tQuerry = "SELECT 'geometry' FROM " + tid + tType;
  mainLayer.setQuery(tQuerry);
  var centerQuery = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + encodeURIComponent(tQuerry));
  centerQuery.send(zoomTo);
}

function zoomTo(response) {

if (!response) {
  alert('no response');
  return;
}

if (response.isError()) {
  alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
  return;
} 
var numRows = response.getDataTable().getNumberOfRows();
var kLats = [];
var kLngs = [];
var swBounds;
var neBounds;
for(var i = 0;i<numRows;i++){
var kml = response.getDataTable().getValue(i, 0);
var kmli = kml.slice(kml.indexOf("-"),kml.lastIndexOf("</"));
var kmlA = kmli.split(" ");

for(var j = 0; j < kmlA.length; j++){
var latLng = kmlA[j];
var comma = latLng.indexOf(",");
if(comma == -1)
{continue;}
else
{
kLngs.push(parseFloat(latLng.slice(0,comma)));
kLats.push(parseFloat(latLng.slice(comma+1)));
}
};
}
if((kLats.length > 1) && (kLngs.length > 1))
{
kLats.sort(function(a,b){return a - b});
kLngs.sort(function(a,b){return a - b});
swBounds = new google.maps.LatLng(kLats.shift(),kLngs.shift());
neBounds = new google.maps.LatLng(kLats.pop(),kLngs.pop());
m.fitBounds(new google.maps.LatLngBounds(swBounds,neBounds));
}
else if((kLats.length == 1) && (kLngs.length == 1))
{
m.setCenter(new google.maps.LatLng(kLats.pop(),kLngs.pop()));
m.setZoom(14);
}
}
function changeStuff(){
    tid = document.getElementById("whichMap").value;
    mainLayer.setMap(null);
     mainLayer = new google.maps.FusionTablesLayer(tid);
    mainLayer.setQuery("SELECT 'geometry' FROM " + tid + tType);
     mainLayer.setMap(m);
}
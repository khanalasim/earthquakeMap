// The web service URL from Drive 'Deploy as web app' dialog.

var DATA_SERVICE_URL = "https://spreadsheets.google.com/feeds/list/1aH6dh_m5DFRoywgAfO8D60cAyR-PVY8zqaiY3C7EP3k/default/public/values?alt=json";

var map;
var geocoder;
var info = new google.maps.InfoWindow();

function initialize() {
	geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(27, 87),
    zoom: 7,
    maxZoom: 20,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
}

$(document).ready(function() {
        $.getJSON(DATA_SERVICE_URL, function(data) {
        	for (var i=0; i< data.feed.entry.length; i++){
        		var value = data.feed.entry[i];
        		var address = value.gsx$wherewereyou.$t;
        		addMarker(address, value);       		
        	}
        });
});

function addMarker(address, value){
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                map: map,
                position: results[0].geometry.location
            });
            
            google.maps.event.addListener(marker,'click', function(){
                showInfo(marker,value );
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });      
}

function showInfo(marker, value){
    var content = "<h3> "+value.gsx$wherewereyou.$t+"</h3>";
    content += "<p>"+value.gsx$whattimewasit.$t+ " on ";
    content += value.gsx$whendidyoufeeltheearthquake.$t+"</p>";
    content += "<p>Duration: "+value.gsx$howlongdiditlast.$t+" seconds </p>";
    content += "<p>Intensity: "+value.gsx$howwastheshaking.$t+"</p>";
    info.setContent(content);  
    info.open(map,marker);
}
// Goal is to give user option between using GPS or Zip Code

$(document).ready(function() {
  var lat, lon,
      F = {}, C = {},
      weather,
      wind
      zip, gps = true;
  
  // Pill Button Click Actions
  $('#gps-pill').click(function() {
    $('#gps-pill').attr('class', 'active');
    $('#zip-pill').attr('class', '');
    gps = true;
    zip = false;
  });
  
  $('#zip-pill').click(function() {
    $('#zip-pill').attr('class', 'active');
    $('#gps-pill').attr('class', '');
    zip = true;
    gps = false;
  });
  // Uses GPS to get current location
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(savePosition);
      alert('it worked so far');
    } else {
      alert("Geolocation is not supported by this browser. Use zip code.");
    }
  }
  function savePosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    alert(lat, lon);
  }
  // Call location with GPS
  console.log('getting location...')
  getLocation();
  
  var gpsWeather = $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon, function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val + "</li>" );});
 
  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "body" );
    console.log(lat, " k ", lon)
});
});
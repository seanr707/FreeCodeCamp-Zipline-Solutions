// Goal is to give user option between using GPS or Zip Code

$(document).ready(function() {
  var F = {}, C = {},
      weather,
      wind,
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
  
  // Temp Converts
  function tempConvert (temp, unit) {
    if (unit === 'c') {
      return Math.round(temp - 273.15);
    } else if (unit === 'f') {
      return Math.round(temp * (9/5) - 459.67);
    } else {
      return undefined;
    }
  }
  // Uses GPS to get current location
  // Took me forever to realize the alert... after getCurrentPosition
  // Made gCP func. not work
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(savePosition);
    } else {
      alert("Geolocation is not supported by this browser. Use zip code.");
    }
  }
  function savePosition(position) {
    gpsWeather(position.coords.latitude, position.coords.longitude);
  }
  // Call location with GPS
  console.log('getting location...')
  getLocation();
  
  function gpsWeather(lat, lon) {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon,saveWeather)
  };
  
  function saveWeather (data) {
    F.curr = tempConvert(data.main.temp, 'f'),
    F.min = tempConvert(data.main.temp_min, 'f'),
    F.max = tempConvert(data.main.temp_max, 'f'),
    C.curr = tempConvert(data.main.temp, 'c'),
    C.min = tempConvert(data.main.temp_min, 'c'),
    C.max = tempConvert(data.main.temp_max, 'c');

    $( "<ul/>", {
      "class": "my-new-list",
      text: 'Currently: '+F.curr+' Hi: '+F.max+' lo: '+F.min,
    }).appendTo( "body" );
  }
                                            
});
// Goal is to give user option between using GPS or Zip Code

$(document).ready(function() {
  var F = {}, C = {},
      weather = {},
      wind,
      gps = true,
      fSwitch = true;

  // Pill Button Click Actions
  $('#gps-pill').click(function() {
    $('#gps-pill').attr('class', 'active');
    $('#zip-pill').attr('class', '');
    if (!gps) {
      getLocation();
      gps = true;
      // Remove Navbar
      $('navbar-form').remove();
    };
    // Removes the zip input
    $('#zip-container').remove()
  });

  $('#zip-pill').click(function() {
    $('#zip-pill').attr('class', 'active');
    $('#gps-pill').attr('class', '');
    if (gps) {
      gps = false;
      // Adds zip input
      var inputAndButton = ['<div class="input-group form-inline">',
                            '<input type="text" class="form-control" placeholder="Zip Code (12345)">',
                            '</div>',
                           ' <button id="zip-submit" type="submit" class="btn btn-primary">Submit</button>'
                           ];
      $('<form/>', {
        class: 'navbar-right navbar-form',
        role: 'search',
        html: inputAndButton.join(''),
      }).appendTo('.pill-center');

      // Zip Submit Button Function
      $('#zip-submit').click(function() {
        console.log('clicked');
        zip = $('.form-control').val();
        console.log('ZIP: ',zip);
        zipWeather(zip);
      });
    }
  });
  // Changes Temp Unit
  $('#F').click(function() {
    $('#F').attr('class', 'btn btn-danger');
    $('#C').attr('class', 'btn btn-default');
    if (!fSwitch) {
      tempUpdate('f');
      fSwitch = true;
    }
  });

  $('#C').click(function() {
    console.log('clicked C');
    $('#C').attr('class', 'btn btn-danger');
    $('#F').attr('class', 'btn btn-default');
    if (fSwitch) {
      tempUpdate('c');
      fSwitch = false;
    }
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

  // For GPS
  function gpsWeather(lat, lon) {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon,saveWeather)
  };
  // For Zip Code
  function zipWeather(zipCode) {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?zip='+zipCode+',us', saveWeather)
  };

  function saveWeather (data) {
    F.curr = tempConvert(data.main.temp, 'f'),
    F.min = tempConvert(data.main.temp_min, 'f'),
    F.max = tempConvert(data.main.temp_max, 'f'),
    C.curr = tempConvert(data.main.temp, 'c'),
    C.min = tempConvert(data.main.temp_min, 'c'),
    C.max = tempConvert(data.main.temp_max, 'c');
    // Sets up weather Icon
    weather = data.weather[0],
      weather.icon = "http://openweathermap.org/img/w/"+weather.icon+".png";
    // Capitalizes string info
    weather.main = weather.main.split(' ').map(function(word) {
      return word[0].toUpperCase() + word.substr(1, word.length-1);
    }).join(' ');
    weather.description = weather.description.split(' ').map(function(word) {
      return word[0].toUpperCase() + word.substr(1, word.length-1);
    }).join(' ');

    // Update HTML Values
    $('city-name').text(data.name);
    $('icon').attr('src', weather.icon);
    tempUpdate('f');
  };

  function tempUpdate(unit) {
    if (unit === 'f') {
      $('curr-temp').text(F.curr);
      $('hi').text(F.max);
      $('lo').text(F.min);
    } else if (unit === 'c') {
      $('curr-temp').text(C.curr);
      $('hi').text(C.max);
      $('lo').text(C.min);
    }
  };
});

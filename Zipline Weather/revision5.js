// Goal is to give user option between using GPS or Zip Code

$(document).ready(function() {
  var F = {}, C = {},
      weather = {},
      gps = true,
      fSwitch = true,
      tempPics = {
        warm: "url('https://upload.wikimedia.org/wikipedia/commons/9/92/Colorful_spring_garden.jpg')",
        mild: "url('https://upload.wikimedia.org/wikipedia/commons/b/bb/Buildings_in_Downtown_Regina_as_seen_from_Victoria_Park.jpg')",
        cool: "url('https://upload.wikimedia.org/wikipedia/commons/d/d0/Cool_weather.jpg')",
        cold: "url('https://upload.wikimedia.org/wikipedia/commons/d/d6/CathedralofLearningLawinWinter.jpg')"
      };

  // Pill Button Click Actions
  $('#gps-pill').click(function() {
    $('#gps-pill').attr('class', 'active');
    $('#zip-pill').attr('class', '');
    if (!gps) {
      getLocation();
      gps = true;
      // Remove Zip Input
      $('.navbar-form').remove();
    };
  });

  $('#zip-pill').click(function() {
    $('#zip-pill').attr('class', 'active');
    $('#gps-pill').attr('class', '');
    // This 'if' prevents it redoing function if
    // clicked twice w/o switching back to GPS
    if (gps) {
      gps = false;

      // Adds zip input
      var inputAndButton = [
        '<div class="input-group form-inline">',
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
    // if prevents it from calling function
    // if it is pressed twice in a row
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

  // Temp Conversionss
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
  // Call location with GPS [default]
  getLocation();

  // For GPS
  function gpsWeather(lat, lon) {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon,saveWeather)
  };

  // For Zip Code
  function zipWeather(zipCode) {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?zip='+zipCode+',us', saveWeather)
  };

  // Function always performed [main]
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
    $('#city-name').text(data.name);
    $('#icon').attr('src', weather.icon);
    $('#desc').text(weather.description);
    $('#wind-dir').text(windDirection(data.wind.deg));
    $('#wind-speed').text(data.wind.speed+' mph');
    tempUpdate('f');
    changeBg(F.curr);
  };

  // Background change function
  function changeBg(temp) {
    // Use Fahrenheit
    if (temp > 70) {
      return $('body').css('background-image', tempPics.warm);
    } else if (temp > 50) {
      return $('body').css('background-image', tempPics.mild);
    } else if (temp > 30) {
      return $('body').css('background-image', tempPics.cool);
    } else {
      return $('body').css('background-image', tempPics.cold);
    }
  }

  // Used by Unit Buttons to quickly
  // change temperature
  function tempUpdate(unit) {
    if (unit === 'f') {
      $('#curr-temp').text(F.curr+'°');
      $('#hi').text('Hi: '+F.max+'°');
      $('#lo').text('Lo: '+F.min+'°');
    } else if (unit === 'c') {
      $('#curr-temp').text(C.curr+'°');
      $('#hi').text('Hi: '+C.max+'°');
      $('#lo').text('Lo: '+C.min+'°');
    }
  };

  // Used to determine direction of wind
  function windDirection(deg) {
    if (deg < 10 || deg > 350) {
      return 'E';
    } else if (deg < 80) {
      return 'NE';
    } else if (deg < 100) {
      return 'N';
    } else if (deg < 170) {
      return 'NW';
    } else if (deg < 190) {
      return 'W';
    } else if (deg < 260) {
      return 'SW';
    } else if (deg < 280) {
      return 'S';
    } else {
      return 'SE';
    }
  };

});

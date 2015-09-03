$(document).ready(function() {
  var $alarm = $('.alarm.time');
  var $snooze = $('.snooze.time');
  var timerOn = false;
  var initAlarm = $alarm.text();
  var initSnooze = $snooze.text();
  var firstRun = true;
  var pauseVal;
  var currType;
  var countPom;
  var breakTime = false;

  function setInit() {
    initAlarm = $alarm.text();
    initSnooze = $snooze.text();
  }

  function saveValue() {
    pauseVal = $('.timer').text();
  }

  function switchType() {
    currType = currType === 'a' ? 's' : 'a';
  }

  function adjustTime(value, which) {
    if (which === 'a' && value > 0) {
      $alarm.text(value);
      $('.timer').text(value);
    } else if (which === 's' && value >= 0) {
      $snooze.text(value);
    } else {
      // Do nothing
    }
  };

  function timeCounter(type, saved) {
    var initTime;
    if (type === 'a') {
      initTime = $alarm.text();
      $('.title').text('Time: ');
    } else {
      initTime = $snooze.text();
      $('.title').text('Wait: ');
    }

    if (saved !== 'n') {
      initTime = pauseVal;
    }

    initTime = parseInt(initTime);

    countPom = setInterval(function() {
      if (initTime - 1 <= 0) {
        window.clearInterval(countPom);
        switchType();

        if (currType === 's') {
          timeCounter(currType, 'n');
        }
      }
      initTime -= 1;
      $('.timer').text(initTime);
    }, 1000);
  }

  $('.adjust').click(function() {
    if (timerOn) {
      return;
    }
    var curr;
    var type;
    $(this).hasClass('alarm') ?
      (curr = $alarm.text(), type = 'a') :
      (curr = $snooze.text(), type = 's');

    if ($(this).hasClass('minus')) {
      curr = parseInt(curr) - 1;
    } else {
      curr = parseInt(curr) + 1;
    }
    adjustTime(curr, type);
  })

  $('button').click(function() {
    var unaltered = ($alarm.text() === initAlarm &&
                   $snooze.text() === initSnooze) ?
                     true : false;

    if ((!timerOn && !unaltered) || firstRun) {
      firstRun = false;
      timerOn = true;
      currType = 'a';
      timeCounter(currType, 'n');
    } else if (!timerOn && unaltered) {
      timerOn = true;
      timeCounter(currType, 'y');
    } else {
      window.clearInterval(countPom);
      saveValue();
      console.log(pauseVal);
      timerOn = false;
    }
  });
});

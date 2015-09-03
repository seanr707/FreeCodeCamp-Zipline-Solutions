$(document).ready(function() {
  var $alarm = $('.alarm.time');
  var $snooze = $('.snooze.time');
  var timerOn = false;
  var initAlarm = $alarm.text();
  var initSnooze = $snooze.text();
  var firstRun = true;
  var alarmSecs;
  var snoozeSecs;
  var formatSecs;
  var pauseVal;
  var currType;
  var countPom;

  function setInit() {
    initAlarm = $alarm.text();
    initSnooze = $snooze.text();
  }

  function setSecs() {
    console.log('Before: ', alarmSecs);
    alarmSecs = parseInt($alarm.text()) * 60;
    console.log('After: ', alarmSecs);
    snoozeSecs = parseInt($snooze.text()) * 60;
  }

  function formatFinal(type) {
    var curr = type === 'a' ? alarmSecs : snoozeSecs;
    var minutes = Math.floor(curr / 60);
    curr -= minutes * 60;
    minutes = minutes.length !== 1 ?
      minutes.toString() : ('0' + minutes.toString());
    curr = curr.length !== 1 ?
      curr.toString() : ('0' + curr.toString());
    formatSecs = minutes + ':' + curr;
    $('.timer').text(formatSecs);
  }

  function saveValue(type) {
    pauseVal = type === 'a' ? alarmSecs : snoozeSecs;
  }

  function switchType() {
    currType = currType === 'a' ? 's' : 'a';
  }

  function adjustTime(value, which) {
    if (which === 'a' && value > 0 || value < 60) {
      $alarm.text(value);
      formatFinal(which);
    } else if (which === 's' && value >= 0 || value < 60) {
      $snooze.text(value);
      formatFinal(which);
    }
  }

  function timeCounter(type, saved) {
    var initTime;
    if (type === 'a') {
      initTime = alarmSecs;
      $('.title').text('Time: ');
    } else {
      initTime = snoozeSecs;
      $('.title').text('Wait: ');
    }

    if (saved !== 'n') {
      initTime = pauseVal;
    }

    countPom = setInterval(function() {
      if (initTime - 1 <= 0) {
        window.clearInterval(countPom);
        switchType();
        timeCounter(currType, 'n');
      }
      initTime -= 1;
      if (type === 'a') {
        alarmSecs = initTime;
      } else {
        snoozeSecs = initTime;
      }
      formatFinal(currType);
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
  });

  $('.btn-primary').click(function() {
    var unaltered = ($alarm.text() === initAlarm &&
                   $snooze.text() === initSnooze) ?
                     true : false;

    if ((!timerOn && !unaltered) || firstRun) {
      firstRun = false;
      timerOn = true;
      currType = 'a';
      setInit();
      setSecs();
      timeCounter(currType, 'n');
    } else if (!timerOn && unaltered) {
      timerOn = true;
      timeCounter(currType, 'y');
    }
  });

  $('.btn-danger').click(function() {
    window.clearInterval(countPom);
    saveValue(currType);
    timerOn = false;
  });
});

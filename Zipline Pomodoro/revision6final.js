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
  var loopCtr;

  // Used to tell if user has changed times since pausing
  function setInit() {
    initAlarm = $alarm.text();
    initSnooze = $snooze.text();
  }

  // Convert minutes to seconds
  function setSecs() {
    alarmSecs = parseInt($alarm.text()) * 60;
    snoozeSecs = parseInt($snooze.text()) * 60;
  }
  // Go ahead and populate values...
  setSecs()

  // Formats to MM:SS
  function formatFinal(type) {
    // Checks whether it is looking at the alarm or snooze time
    var curr = type === 'a' ? alarmSecs : snoozeSecs;
    var minutes = Math.floor(curr / 60);
    curr -= minutes * 60;
    // Adds a '0' in front of single digit numbers
    minutes = minutes.toString().length !== 1 ?
      minutes.toString() : ('0' + minutes.toString());
    curr = curr.toString().length !== 1 ?
      curr.toString() : ('0' + curr.toString());
    formatSecs = minutes + ':' + curr;
    // Outputs to DOM
    $('.timer').text(formatSecs);
  }

  // Saves value for later use
  function saveValue(type) {
    pauseVal = type === 'a' ? alarmSecs : snoozeSecs;
  }

  // Switches between 'alarm' and 'snooze' ('a' & 's')
  function switchType() {
    currType = currType === 'a' ? 's' : 'a';
  }

  // Function for plus and minus buttons
  function adjustTime(value, which) {
    if (which === 'a' && value > 0) {
      $alarm.text(value);
      $('.timer').text(value.toString() + ':00');
    } else if (which === 's' && value >= 0) {
      $snooze.text(value);
    }
  }

  function alarm(type) {
    if (type === 'a') {
      alert('Time for a break!');
    } else {
      alert('Time to start working again!');
    }
  }

  // Main function: The Timer
  function timeCounter(type, saved) {
    var initTime;
    if (type === 'a') {
      initTime = alarmSecs;
      $('.title').text('Time: ');
    } else {
      initTime = snoozeSecs;
      $('.title').text('Wait: ');
    }
    // Resumes where user left off
    if (saved !== 'n') {
      initTime = pauseVal;
    }
    // Begins counting down
    countPom = setInterval(function() {
      // Time cannot go below 0
      if (initTime - 1 <= 0) {
        window.clearInterval(countPom);
        // Sends alert to user
        alarm(currType);
        // Switches to other clock
        switchType();

        loopCtr += 1;
        // If clock has run through once on each type resets and repeats
        if (loopCtr >= 2) {
          firstRun = true;
          startClock();
        } else {
          // Begins clock again with other type
          timeCounter(currType, 'n');
        }
      }
      initTime -= 1;
      // returns the new value back to the global current variable
      if (type === 'a') {
        alarmSecs = initTime;
      } else {
        snoozeSecs = initTime;
      }
      formatFinal(currType);
    }, 1000);
  }

  $('.adjust').click(function() {
    // Cannot adjust the settings while the timer is running
    if (timerOn) {
      return;
    }
    var curr;
    var type;
    // Decides which time the user is adjusting
    $(this).hasClass('alarm') ?
      (curr = $alarm.text(), type = 'a') :
      (curr = $snooze.text(), type = 's');
    // Decides whether the user is adding or subtracting
    if ($(this).hasClass('minus')) {
      curr = parseInt(curr) - 1;
    } else {
      curr = parseInt(curr) + 1;
    }
    // Calls for earlier function to enact changes to DOM
    adjustTime(curr, type);
  });

  function startClock() {
    // true if unaltered values since last use
    var unaltered = ($alarm.text() === initAlarm &&
                   $snooze.text() === initSnooze) ?
                     true : false;

    // Resets everything and starts over if first run or if there has been a
    // change since last run
    if ((!timerOn && !unaltered) || firstRun) {
      firstRun = false;
      timerOn = true;
      loopCtr = 0;
      currType = 'a';
      // Repopulates initial values and seconds
      setInit();
      setSecs();
      timeCounter(currType, 'n');
    } else if (!timerOn && unaltered) {
      // If unaltered continues where left off
      timerOn = true;
      timeCounter(currType, 'y');
    }
  }

  $('.btn-primary').click(startClock);

  // Saves place and pauses
  $('.btn-danger').click(function() {
    // Only performs if clock running (should save memory)
    if (timerOn) {
      window.clearInterval(countPom);
      saveValue(currType);
      timerOn = false;
    }
  });
});

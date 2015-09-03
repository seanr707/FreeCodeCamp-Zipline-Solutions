# Reformatted JS from Simon Says Zipline into CoffeeScript for practice of CS
app = angular.module 'simon', []

app.controller 'simonSays', ['$scope', '$timeout', '$interval', ($scope, $interval, $timeout) ->
  $scope.colors = ['red', 'yellow', 'green', 'blue']
  # Colors for top row
  $scope.top = $scope.colors[0..1]
  # Colors for bottom row
  $scope.bottom = $scope.colors[2..3]
  $scope.turn = 0
  # For Displaying turns and erros
  $scope.display = '--'
  $scope.playText = "Play"
  # Turns where speed changes
  $scope.speedTurns = [5, 9, 13]
  $scope.speed = 1500
  # Amount to speed up by
  $scope.decrease = 100
  $scope.order = []
  $scope.userInput = []
  # Whether game buttons are covered or not
  $scope.cover = true
  $scope.win = false
  $scope.on = false
  # Whether user has entered in full set of buttons or not
  $scope.entered = false
  # Number of times reset, prevents old $timeouts from triggering after a reset
  instanceNumber = 0

  sound = (color) ->
    this.elem = document.getElementById color
    this.elem.duration = 0.2

  $scope.chgDisplay = (num) ->
    if num == 0
      $scope.display = '--'
    else if num == 'error'
      $scope.display = '!!'
    else 
      $scope.display = parseInt num

  # For waiting for user complete input
  $scope.waiting = (reset, turn) ->
    # Gives player 5s or same time as CPU, whichever is greater
    time = 3000 > $scope.speed * $scope.order.length ? 3000 : $scope.speed * $scope.order.length
    # Rings incorrect if player takes too long
    wait = $timeout ->
      if $scope.userInput.length != $scope.order.length && !$scope.entered && $scope.on && reset == instanceNumber && turn == $scope.turn
        # If strict reset completely, else just start from last one
        if $scope.strict
          $scope.incorrect $scope.reset()
         else 
          $scope.incorrect $scope.playList $scope.order
        
        $scope.cover = true
       else 
        # Resets Entered to false
        $scope.entered = false
      
      # Stop timer
      $timeout.cancel wait
    , time
  

  # Adds color to list
  $scope.genList = (order) ->
    return if !$scope.on
    # Add random color to list and increase turn count
    order.push $scope.colors[Math.floor Math.random() * 3.99]
    $scope.turn++
    $scope.chgDisplay $scope.turn
  

  # Main CPU 
  $scope.playList = (order) ->
    # If off stop
    return if !$scope.on
    # Covers inputs from user actions
    $scope.cover = true
    # Start at beginning of list each time
    i = 0
    # Empties user input
    $scope.userInput = []
    # If a certain turn, speed up or you win
    if $scope.turn == $scope.speedTurns[0]
      # Remove item from the speedTurn list
      $scope.speedTurns.shift()
      # Speed it up
      $scope.speed -= $scope.decrease
     
    # If the user reaches turn 20 successfully, they win!
    else if $scope.turn > 20
      $scope.win = true
      # Stops game from continuing
      $scope.on = false
      winReset = $timeout ->
        # Let's game start over immediately after resetting
        $scope.on = true
        $scope.reset()
        $timeout.cancel winReset
      , 5000
    

    # Start an interval of going through colors based on Order and Speed
     wait = $interval ->
      # Force stop if off
      if !$scope.on
        $interval.cancel wait
        return
      
      # Sets current item
      item = order[i]
      # Creates sound for 'press'
      audio = new sound item
      # Lights up button
      $('.' + item).addClass 'lighten'
      # Plays sound
      audio.elem.play()
      # Turns off light and after half second
      light = $timeout ->
        $timeout.cancel light
        $('.' + item).removeClass 'lighten'
      , 500

      # Stop at end of Order
      if i >= $scope.order.length - 1
        $interval.cancel wait
        $scope.cover = false
        # User has entered nothing!
        # $scope.entered = false
        # Start waiting for user input
        $scope.waiting instanceNumber, $scope.turn
       else 
        # Next item
        i++
    , $scope.speed

  # Plays loud noises and !! if incorrect sequence
  $scope.incorrect = (func) ->
    # Prevents another instance of incorrect from starting
    # $scope.entered = true

    $scope.chgDisplay 'error'
    # Plays all sounds too annoy user for being wrong
    $scope.colors.forEach (color) ->
      audio = new sound color
      audio.elem.play()

    # Restores Count and executes input 
    wrong = $timeout ->
      # Restores count number
      $scope.chgDisplay $scope.turn
      func
      $timeout.cancel wrong
    , 1000
  

  # Main User 
  $scope.add = (color) ->
    return if !$scope.on

    # Push user's input
    $scope.userInput.push color

    # Play corresponding sound
    audio = new sound color
    audio.elem.play()

    # Sets up a 'wrong'  based on strict mode
    wrongFunc = ->
      if $scope.strict
        $scope.incorrect $scope.reset()
      else
        $scope.incorrect $scope.playList $scope.order

    # Checks each click to see if it is the right button
    if $scope.order[$scope.userInput.length - 1] != $scope.userInput[$scope.userInput.length - 1]
        instanceNumber++
        wrongFunc()
    
    # Waits for user to complete all turns
    if $scope.userInput.length < $scope.order.length
      $scope.cover = false
      return

    # Stops waiting timer (keeps user from taking too long)
    #$scope.entered = true
    # Prevents further input
    $scope.cover = true

    # Continues game
    $scope.genList $scope.order
    $scope.playList $scope.order
  

  $scope.reset = ->
    # Cannot successfully reset in mid CPU turn, must be user's turn to reset
    wasOn = $scope.on
    $scope.on = false
    $scope.turn = 0
    # Reset display
    $scope.chgDisplay $scope.turn
    $scope.order = []
    $scope.userInput = []
    $scope.win = false
    instanceNumber++
    # Prevents waiting timer from going off it reset too quickly
    # $scope.entered = true
    if wasOn
      $scope.on = true
      $scope.genList $scope.order
      $scope.playList $scope.order
    
    

  # Play button 
  $scope.play = ->
    if !$scope.on
      # Resets if strict mode is enabled
      # Done here so on = false and won't call playList twice!
      $scope.reset() if $scope.strict
      $scope.on = true
      $scope.playText = "Pause"
      # If first turn generate a color
      $scope.genList $scope.order if $scope.turn == 0
      # Else just resume
      $scope.playList $scope.order
    else 
      $scope.on = false
      $scope.reset() if $scope.strict
      # Prevent input once paused
      $scope.cover = true
      $scope.playText = "Play"
]
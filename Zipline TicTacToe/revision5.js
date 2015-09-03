var app = angular.module('ttt', []);

app.controller('ctrl', function($scope) {
  $scope.letters = ['X', 'O'];
  // Human an CPU store as X or O
  $scope.human;
  $scope.cpu;
  // Winning/Losing Message
  $scope.message;
  // Whether someone has chosen X or O
  $scope.choice = false;
  // Whose turn it is
  $scope.turn = 'cpu';
  // Count turns til 9 (end)
  $scope.countTurn = 0;
  // Have you won yet?
  $scope.win = false;
  $scope.top = {
    left: {
      name: 'left',
      val: '-',
      filled: false,
      owner: '',
    },
    center: {
      name: 'center',
      val: '-',
      filled: false,
      owner: '',
    },
    right: {
      name: 'right',
      val: '-',
      filled: false,
      owner: '',
    },
  };
  $scope.mid = {
    left: {
      name: 'left',
      val: '-',
      filled: false,
      owner: '',
    },
    center: {
      name: 'center',
      val: '-',
      filled: false,
      owner: '',
    },
    right: {
      name: 'right',
      val: '-',
      filled: false,
      owner: '',
    },
  };
  $scope.bottom = {
    left: {
      name: 'left',
      val: '-',
      filled: false,
      owner: '',
    },
    center: {
      name: 'center',
      val: '-',
      filled: false,
      owner: '',
    },
    right: {
      name: 'right',
      val: '-',
      filled: false,
      owner: '',
    },
  };
  // These were not put in scope because they are only needed within
  // Used to simplify looping through tiles to check on them
  var rows = {
    0: 'top',
    1: 'mid',
    2: 'bottom',
  };
    
  var tiles = {
    0: 'left',
    1: 'center',
    2: 'right',
  };
  
  // Move Order for CPU, more is added after Human's first move
  var moveOrder = [ [1, 1] ];
  
  $scope.choose = function(choice) {
    if (choice === 'X') {
      $scope.human = 'X';
      $scope.cpu = 'O';
    } else {
      $scope.human = 'O';
      $scope.cpu = 'X';
    }
    // Hide display and start CPU Turn
    $scope.choice = true;
    $scope.sim();
  }
  
  $scope.sim = function() { 
    // Prevents more than one move per turn
    var foundBlock = false;
    // Default moveset; others done if Human makes specific first move
    var moveOrder1 = [
      [1, 1], [2, 2],
      [0, 0], [0, 2],
      [2, 0], [1, 2],
      [1, 0], [0, 1],
      [2, 1],
    ];
    // For top-left or mid-left tile selected
    var moveOrder2 = [
      [1, 1], [2, 0],
      [0, 2], [0, 1],
      [2, 1], [1, 2],
      [1, 0], [2, 2],
      [0, 0],
    ];
    // For bottom-right tile selected
    var moveOrder3 = [
      [1, 1], [2, 2],
      [2, 0], [0, 2],
      [1, 2], [1, 0],
      [2, 1], [0, 1],
      [0, 0],
    ];
    // For bottom-left tile selected
    var moveOrder4 = [
      [1, 1], [0, 0],
      [2, 0], [2, 2],
      [2, 1], [0, 1],
      [0, 2], [1, 0],
      [1, 2],
    ];
    // Only changes moveOrder within first 3 turns (After user's first turn [2])
    if ($scope.countTurn <= 3 ) {
      if ($scope.top.left.filled && $scope.top.left.owner === 'human' ||
          $scope.mid.left.filled && $scope.mid.left.owner === 'human') {
        moveOrder = moveOrder2;
      } else if ($scope.bottom.right.filled && $scope.bottom.right.owner === 'human') {
        moveOrder = moveOrder3;
      } else if ($scope.bottom.left.filled && $scope.bottom.left.owner === 'human') {
        moveOrder = moveOrder4;
      } else {
        moveOrder = moveOrder1;
      }
    }
    // If block isn't filled and CPU hasn't moved yet, places mark at tile from moveOrder
    moveOrder.forEach(function(item) {
      if ($scope[rows[item[0]]][tiles[item[1]]].filled === false && foundBlock === false) {
        foundBlock = true;
        $scope.add($scope[rows[item[0]]][tiles[item[1]]].name, rows[item[0]], $scope.cpu);
      }
    })
  }
  // Main function for adding marks | place (i.e. left), level (i.e. bottom), who (i.e. 'X')
  $scope.add = function(place, level, who) {
    // No moves if tile is already filled
    if ($scope[level][place].filled) return;
    // No moves if the game is over
    if ($scope.win) return;

    // Put X or O in tile
    $scope[level][place].val = who;
    $scope[level][place].filled = true;
    // Set owner of tile (Human or CPU)
    $scope[level][place].owner = $scope.turn;

    $scope.countTurn += 1;

    // Check for a winner
    winCheck($scope.turn);

    // Switches turn
    if ($scope.turn === 'cpu') {
      $scope.turn = 'human';
    } else {
      $scope.turn = 'cpu';
      $scope.sim();
    }
  }

  // Resets board to default values
  $scope.reset = function() {
    var rows = ['top', 'mid', 'bottom'];
    // Goes through each row
    rows.forEach(function(item) {
      // Creates and loops through each tile in row
      Object.keys($scope[item]).forEach(function(subitem) {
        $scope[item][subitem].val = '-';
        $scope[item][subitem].filled = false;
        $scope[item][subitem].owner = '';
      });
    });

    $scope.countTurn = 0;
    $scope.win = false;
    $scope.turn = 'cpu';
    // User chooses again
    $scope.choose = false;
  }

  // Checks for a victory/loss, takes input 'human' or 'CPU'
  function winCheck(who) {
    var winCombo = [
      // 3 in a Row
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      // 3 in a Col.
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      // 3 in a Diag.
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];

    // Go through each possible victory trio
    winCombo.forEach(function(item) {
      var winCount = 0;
      // Go through each tile (Row, Col)
      item.forEach(function(sub) {
        // Increase winCount if all 3 are filled by the same owner
        if ($scope.win === false &&
            winCount <= 3 &&
            $scope[rows[sub[0]]][tiles[sub[1]]].filled &&
            $scope[rows[sub[0]]][tiles[sub[1]]].owner === who) {
          console.log(rows[sub[0]], tiles[sub[1]]);
          winCount += 1;
        }
      });
      // If 3 in a row then someone has won
      if (winCount === 3) $scope.win = true;
    });

    // Adjusts the message that pops up
    if ($scope.win) {
      $scope.message = who + " wins!"
    } else if ($scope.countTurn === 9) {
      $scope.message = "It's a tie...";
      // This is set to true just as an easy way to display popup
      $scope.win = true;
    }
  }
});

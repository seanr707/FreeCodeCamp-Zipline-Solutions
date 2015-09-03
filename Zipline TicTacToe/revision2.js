var app = angular.module('ttt', []);

app.controller('ctrl', function($scope) {
  $scope.letters = ['X', 'O'];
  $scope.human;
  $scope.cpu;
  $scope.choice = false;
  $scope.turn = 'cpu';
  $scope.countTurn = 0;
  $scope.top = {
    left: {
      num: 0,
      name: 'left',
      val: ' ',
      filled: false,
    },
    center: {
      num: 1,
      name: 'center',
      val: ' ',
      filled: false,
    },
    right: {
      num: 2,
      name: 'right',
      val: ' ',
      filled: false,
    },
  };
  $scope.mid = {
    left: {
      num: 0,
      name: 'left',
      val: ' ',
      filled: false,
    },
    center: {
      num: 1,
      name: 'center',
      val: ' ',
      filled: false,
    },
    right: {
      num: 2,
      name: 'right',
      val: ' ',
      filled: false,
    },
  };
  $scope.bottom = {
    left: {
      num: 0,
      name: 'left',
      val: ' ',
      filled: false,
    },
    center: {
      num: 1,
      name: 'center',
      val: ' ',
      filled: false,
    },
    right: {
      num: 2,
      name: 'right',
      val: ' ',
      filled: false,
    },
  };
  
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
  
  $scope.choose = function(choice) {
    if (choice === 'X') {
      $scope.human = 'X';
      $scope.cpu = 'O';
    } else {
      $scope.human = 'O';
      $scope.cpu = 'X';
    }
    $scope.choice = true;
    $scope.sim();
  }
  
  $scope.sim = function() { 
    var foundBlock = false;
    var moveOrder = [];
    
    // This works for random placement, but does not guarantee a CPU victory;
    Object.keys(rows).forEach(function(item) {
      Object.keys(tiles).forEach(function(subitem) {
        var row_chance = item;
        var col_chance = subitem;

        //console.log('Filled? ', $scope[rows[item]][tiles[subitem]].filled);
        if ($scope[rows[item]][tiles[subitem]].filled == false && Math.round(Math.random()) === 1 && foundBlock === false) {
          // $scope.turn = 'human';
          foundBlock = true;
          $scope.add($scope[rows[item]][tiles[subitem]].name, rows[item], $scope.cpu);
        }
      });
    });
    if (foundBlock === false) {
      $scope.sim();
    }
  }
  
  $scope.add = function(place, level, who) {
    if ($scope[level][place].filled) return;

    $scope[level][place].val = who;
    $scope[level][place].filled = true;
    
    $scope.countTurn += 1;
    
    winCheck();
    
    if ($scope.turn === 'cpu') {
      $scope.turn = 'human';
    } else {
      $scope.turn = 'cpu';
      $scope.sim();
    }
  }
  
  $scope.reset = function() {
    var rows = ['top', 'mid', 'bottom'];
    rows.forEach(function(item) {
      Object.keys($scope[item]).forEach(function(subitem) {
        $scope[item][subitem].val = ' ';
        $scope[item][subitem].filled = false;
      });
    });
    $scope.sim();
  }
  
  function winCheck() {
    var win = false;
    var winCombo = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];
    
    winCombo.forEach(function(item) {
      var winCount = 0;
      item.forEach(function(sub) {
        //console.log(sub);
        //console.log($scope[rows[sub[0]]][tiles[sub[1]]].filled);
        if (win === false &&
            winCount < 3 &&
            $scope[rows[sub[0]]][tiles[sub[1]]].filled) {
          winCount += 1;
        }
      })
      if (winCount === 3) win = true;
    })
    console.log('You win? ', win);
    return win;
  }
})
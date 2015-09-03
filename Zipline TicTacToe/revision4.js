var app = angular.module('ttt', []);

app.controller('ctrl', function($scope) {
  $scope.letters = ['X', 'O'];
  $scope.human;
  $scope.cpu;
  $scope.message;
  $scope.choice = false;
  $scope.turn = 'cpu';
  $scope.countTurn = 0;
  $scope.win = false;
  $scope.top = {
    left: {
      num: 0,
      name: 'left',
      val: '-',
      filled: false,
      owner: '',
    },
    center: {
      num: 1,
      name: 'center',
      val: '-',
      filled: false,
      owner: '',
    },
    right: {
      num: 2,
      name: 'right',
      val: '-',
      filled: false,
      owner: '',
    },
  };
  $scope.mid = {
    left: {
      num: 0,
      name: 'left',
      val: '-',
      filled: false,
      owner: '',
    },
    center: {
      num: 1,
      name: 'center',
      val: '-',
      filled: false,
      owner: '',
    },
    right: {
      num: 2,
      name: 'right',
      val: '-',
      filled: false,
      owner: '',
    },
  };
  $scope.bottom = {
    left: {
      num: 0,
      name: 'left',
      val: '-',
      filled: false,
      owner: '',
    },
    center: {
      num: 1,
      name: 'center',
      val: '-',
      filled: false,
      owner: '',
    },
    right: {
      num: 2,
      name: 'right',
      val: '-',
      filled: false,
      owner: '',
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
  
  var moveOrder = [ [1, 1] ];
  
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
    var moveOrder1 = [
      [1, 1], [2, 2],
      [0, 0], [0, 2],
      [2, 0], [1, 2],
      [1, 0], [0, 1],
      [2, 1],
    ];
    
    var moveOrder2 = [
      [1, 1], [2, 0],
      [0, 2], [0, 1],
      [2, 1], [1, 2],
      [1, 0], [2, 2],
      [0, 0],
    ];
    
    var moveOrder3 = [
      [1, 1], [2, 2],
      [2, 0], [0, 2],
      [1, 2], [1, 0],
      [2, 1], [0, 1],
      [0, 0],
    ];
    
    var moveOrder4 = [
      [1, 1], [0, 0],
      [2, 0], [2, 2],
      [2, 1], [0, 1],
      [0, 2], [1, 0],
      [1, 2],
    ];
    
    // moveOrder = Math.round(Math.random()) === 1 ? moveOrder1 : moveOrder2;
    if ($scope.countTurn <= 3 ) {
      console.log('start move check')
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
    
    moveOrder.forEach(function(item) {
      if ($scope[rows[item[0]]][tiles[item[1]]].filled === false && foundBlock === false) {
        foundBlock = true;
        $scope.add($scope[rows[item[0]]][tiles[item[1]]].name, rows[item[0]], $scope.cpu);
      }
    })
  }
  
  $scope.add = function(place, level, who) {
    if ($scope[level][place].filled) return;
    if ($scope.win) return;

    $scope[level][place].val = who;
    $scope[level][place].filled = true;
    $scope[level][place].owner = $scope.turn;
    
    $scope.countTurn += 1;
    
    winCheck($scope.turn);
    
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
        $scope[item][subitem].val = '-';
        $scope[item][subitem].filled = false;
        $scope[item][subitem].owner = '';
      });
    });
    console.log($scope.top, $scope.mid, $scope.bottom);
    $scope.countTurn = 0;
    $scope.win = false;
    $scope.turn = 'cpu';
    $scope.sim();
  }
  
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
    
    winCombo.forEach(function(item) {
      var winCount = 0;
      //console.log(winCount, ' <- Should be 0')
      item.forEach(function(sub) {
        //console.log(sub);
        //console.log($scope[rows[sub[0]]][tiles[sub[1]]].filled);
        if ($scope.win === false &&
            winCount <= 3 &&
            $scope[rows[sub[0]]][tiles[sub[1]]].filled &&
            $scope[rows[sub[0]]][tiles[sub[1]]].owner === who) {
          console.log(rows[sub[0]], tiles[sub[1]]);
          winCount += 1;
        }
      });
      if (winCount === 3) $scope.win = true;
    });
    console.log("Turn ", $scope.countTurn);
    if ($scope.win) {
      $scope.message = who + " wins!"
      console.log(who, " wins!");
    } else if ($scope.countTurn === 9) {
      $scope.message = "It's a tie...";
      $scope.win = true;
      console.log('Draw');
    }
    return $scope.win;
  }
})
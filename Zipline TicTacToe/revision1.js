var app = angular.module('ttt', []);

app.controller('ctrl', function($scope) {
  $scope.letters = ['X', 'O'];
  $scope.human;
  $scope.cpu;
  $scope.choice = false;
  $scope.turn = 'cpu';
  $scope.top = {
    num: 0,
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
    num: 1,
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
    num: 2,
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
    
    console.log('Starting CPU turn');
    Object.keys(rows).forEach(function(item) {
      Object.keys(tiles).forEach(function(subitem) {
        var row_chance = item;
        var col_chance = subitem;
        // console.log(item, subitem);
        // Could use -> Math.floor(Math.random() * 10 / 4)

        /*
          if (Math.round(Math.random()) !== 1) {
            if (item >= 1){
              row_chance = Math.abs(item - 1);
            } else {
              row_chance = 2;
            }
          } else {
            if (subitem >= 1){
              col_chance = Math.abs(subitem - 1);
            } else {
              col_chance = 2;
            }
          }
          console.log('Chance: ', row_chance, col_chance)
          if ($scope[rows[item]][tiles[subitem]].filled) {
            $scope.add($scope[rows[row_chance]][tiles[col_chance]].name, rows[item], $scope.cpu);
          }
          */
        console.log('Filled? ', $scope[rows[item]][tiles[subitem]].filled);
        if ($scope[rows[item]][tiles[subitem]].filled == false && Math.round(Math.random()) === 1) {
          console.log('Should be done.')
          // $scope.turn = 'human';
          $scope.add($scope[rows[item]][tiles[subitem]].name, rows[item], $scope.cpu);
          stop;
        }
        
        console.log('Random not 1')
      });
    });
    if ($scope.turn === 'human') {
      return;
    } else {
      // $scope.sim(); 
    }
  }
  
  $scope.add = function(place, level, who) {
    if ($scope[level][place].filled) return;

    $scope[level][place].val = who;
    $scope[level][place].filled = true;
    
    console.log('Changed: ', $scope[level][place]);
    
    if ($scope.turn === 'cpu') {
      $scope.turn = 'human';
      // $scope.sim();
    } else {
      console.log('Human is done.')
      $scope.turn = 'cpu';
    }
  }
  
  $scope.reset = function() {
    var rows = ['top', 'mid', 'bottom'];
    rows.forEach(function(item) {
      Object.keys($scope[item]).forEach(function(subitem) {
        console.log(item, subitem)
        $scope[item][subitem].val = ' ';
        $scope[item][subitem].filled = false;
      });
    });
  }
})
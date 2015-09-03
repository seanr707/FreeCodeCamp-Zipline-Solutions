var calcApp = angular.module('calcApp', []);

calcApp.controller('calcCtrl', function($scope){
  $scope.nums = [
    7, 8, 9,
    4, 5, 6,
    1, 2, 3,
  ];
  $scope.zero = 0;
  $scope.store = 0;
  $scope.mem = [];
  $scope.curr = 0;
  $scope.display = 0;
  $scope.ops = {
    plus: '+',
    minus: '-',
    multiply: '*',
    divide: '/',
    percent: '%',
    ac: 'AC',
    ce: 'CE',
  };
  // Work in progress to make loop to create buttons in angular
  $scope.order = {
    plus: {
      disp: '+',
      val: '+',
      func: $scope.pressOp(this.val)
    },
    minus: {
      disp: '-',
      val: '-',
      func: $scope.pressOp(this.val)
    },
    multiply: {
      disp: 'x',
      val: '*',
      func: $scope.pressOp(this.val)
    },
    divide: {
      disp: '÷',
      val: '/',
      func: $scope.pressOp(this.val),
    },
    equal: {
      disp: '=',
      val: undefined,
      func: $scope.equal(),
    },
    ac: {
      disp: 'AC',
      val: undefined,
      func: $scope.clear(this.disp),
    },
  };
  
  $scope.update = function(type) {
    if (type === 'c') {
      $scope.display = $scope.curr;
    } else {
      $scope.display = $scope.store;
    }
  }
  
  $scope.pressNum = function(num) {
    if ($scope.curr.length > 9) {
      return;
    }
    $scope.curr = ($scope.curr * 10) + num;
    $scope.update('c');
  }
  
  $scope.pressOp = function(op) {
    // For changing sign in use
    if ($scope.mem[1] && $scope.curr === 0) {
      $scope.mem[1] = op;
      return;
    }
    
    $scope.mem.push($scope.curr.toString());
    $scope.curr = 0;
    $scope.store = eval($scope.mem.join(''));
    $scope.mem = [$scope.store.toString(), op];
    $scope.update('s');
    console.log($scope.mem);
  }
  
  $scope.clear = function(type) {
    if (type === 'ac') {
      $scope.curr = 0;
      $scope.store = 0;
      $scope.display = 0;
      $scope.mem = [];
    } else {
      $scope.curr = 0;
      $scope.display = 0;
    }
  }
  
  $scope.equal = function() {
    $scope.mem.push($scope.curr.toString());
    $scope.curr = 0;
    $scope.store = eval($scope.mem.join(''));
    $scope.update('s');
  }
  
});
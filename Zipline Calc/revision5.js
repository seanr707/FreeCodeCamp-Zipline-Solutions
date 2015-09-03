// Calculator Solution by Seanr707 for FreeCodeCamp
// Copying of this solution without credit and permission of author is not allowed
var calcApp = angular.module('calcApp', []);

calcApp.controller('calcCtrl', function($scope){
  $scope.nums = [
    7, 8, 9,
    4, 5, 6,
    1, 2, 3,
  ];
  // Seperate these for CSS sizing purposes
  $scope.bottom = [0, '.',];
  // Where sum is stored
  $scope.store = 0;
  // Where ints turned to strings, conectated, eval()
  // Always maxes at 3 items: [store, operand, current] -> [store, waitForOperand]
  $scope.mem = [];
  // Current entry we are entering
  $scope.curr = 0;
  // What displays in the view
  $scope.display = 0;
  // Maximum Characters for display
  var maxChar = 12;
  
  // Changes what is displayed to users; rounds so it fits in textarea
  $scope.update = function(type) {
    // 'c' for current OR 's' for stored
    if (type === 'c') {
      $scope.display = $scope.curr;
    } else {
      $scope.display = $scope.store;
    }
    // Rounds if the number is too large
    if ($scope.display.toString().length > maxChar) {
      $scope.display = Math
        .round($scope.display * Math.pow(10, maxChar)) / Math.pow(10, maxChar);
    }
  }
  
  function opExec(mem, op) {
    // If len < 3 then it is waiting to receive input
    // Return first number to wait
    if (mem.length < 3) {
      return mem[0]; 
    }
    // Parse var's just in case there's any string data
    mem[0] = parseFloat(mem[0]);
    mem[2] = parseFloat(mem[2]);
    // Perform operation
    switch(op) {
      case '+':
        return mem[0] + mem[2];
      case '-':
        return mem[0] - mem[2];
      case '*':
        return mem[0] * mem[2];
      case '/':
        return mem[0] / mem[2];
    }
  }
  
  // Runs when any number or decimal is pressed
  $scope.pressNum = function(num) {
    // Prevents overflowing textarea
    if ($scope.curr.length >= maxChar) {
      return;
    }
    // Prevents multiple decimals
    if (num === '.' && $scope.curr.toString().match(/[^0-9|-]/g)) {
      return;
    }
    // Prevents displaying as '0892'
    if ($scope.curr === 0) {
      $scope.curr = '';
    }
    
    // Converts to string for easy number conectation (especially with decimal button)
    $scope.curr = $scope.curr.toString() + num.toString();
    
    $scope.update('c');
  }
  
  // Operand function
  $scope.pressOp = function(op) {
    // For changing operand in use instead of stacking them in mem
    if ($scope.mem[1] && $scope.curr === 0) {
      $scope.mem[1] = op;
      return;
    }
    
    // NOTE: Used strings instead of numbers so eval can be used to
    // parse operands unconditionally

    // Push current entry in the memory
    $scope.mem.push($scope.curr);

    // Empty the current entry
    $scope.curr = 0;

    // Evaluate our 3 (or 2 if first press) items in memory and move them 
    // to storage
    $scope.store = opExec($scope.mem, $scope.mem[1]);
    
    // Add stored sum and the operand to memory
    $scope.mem = [$scope.store, op];
    // Updates display to stored number, so '2+3+4' would display '5' when
    // I press '+' the second time, until '4' is pressed
    $scope.update('s');
  }
  
  $scope.clear = function(type) {
    if (type === 'ac') {
      // Clears all memory
      $scope.curr = 0;
      $scope.store = 0;
      $scope.update('c');
      $scope.mem = [];
    } else {
      // Clears current entry
      $scope.curr = 0;
      $scope.update('c');
    }
  }
  
  // NA is a null variable used to make ngRepeat usable on all entries in HTML
  // Most functions pass a variable through, so some functions need null values
  // So that the ngRepeat loop can be used unconditionally
  $scope.equal = function(NA) {
    // Pushes current to memory
    $scope.mem.push($scope.curr);
    // Eval's memory and moves to current, so it can be operated on
    $scope.curr = opExec($scope.mem, $scope.mem[1]);
    // Clears everything out
    $scope.store = 0;
    $scope.mem = [];
    $scope.update('c');
  }
  
  // Changes pos/neg value of number in current
  $scope.chgSign = function(NA) {
    if ($scope.curr === 0) {
      return;
    }
    $scope.curr *= -1;
    $scope.update('c');
  }
  
  // NOTE: These objects were added last because they call on functions from above

  // Operands on side in order
  // IDs added so size could be changed on plus sign in CSS
  $scope.side = {
    multiply: {
      id: 'mult',
      disp: 'x',
      val: '*',
      func: $scope.pressOp,
    },
    divide: {
      id: 'div',
      disp: '÷',
      val: '/',
      func: $scope.pressOp,
    },
    minus: {
      id: 'minus',
      disp: '-',
      val: '-',
      func: $scope.pressOp,
    },
    plus: {
      id: 'plus',
      disp: '+',
      val: '+',
      func: $scope.pressOp,
    },
  };
  
  // Operands on top in order
  $scope.top = {
    ac: {
      disp: 'AC',
      val: 'ac',
      func: $scope.clear,
    },
    ce: {
      disp: 'CE',
      val: 'ce',
      func: $scope.clear,
    },
    changeSign: {
      disp: '±',
      val: null,
      func: $scope.chgSign,
    },
    /* Not enough room for this operand (least needed) yet
    percent: {
      disp: '%',
      val: '%',
      func: $scope.pressOp,
    },
    */
    equal: {
      disp: '=',
      val: null,
      func: $scope.equal,
    },
  };
});

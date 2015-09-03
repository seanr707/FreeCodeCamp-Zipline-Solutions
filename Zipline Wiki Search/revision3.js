var queryURL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=5&format=json&rawcontinue=true&indexpageids=true&srprop=sectiontitle&srinfo=suggestion&srsearch='

var wikiApp = angular.module('wikiApp', [])
  .controller('wikiCtrl', ['$scope', '$http',
    function($scope, $http) {
    // Example Wiki API
    // ?action=query&list=search&srlimit=5&srsearch=windows&format=json&rawcontinue=true
    // action=query (search)
    // srlimit = limits number of items | srsearch = searches for text
    // rawcontinue = require for API


    $scope.search = function() {
      var search = $scope.search;
      console.log($scope);
      console.log($scope.search, search);
      // Exits if nothing was entered
      if (search == '') {
        return;
      }

      $http.jsonp(queryURL + search + '&callback=JSON_CALLBACK').success(function(data) {
        $scope.results = data.query.search;
      })
      /*
      $.ajax( {
        url: queryURL + search,
        crossDomain: true,
        dataType: 'jsonp',
        type: 'POST',
        headers: { 'Api-User-Agent': 'Example/1.0' },
        success: function(data) {
          $scope.results = data.query.search;
        }
      });
      */
    }
  }]);

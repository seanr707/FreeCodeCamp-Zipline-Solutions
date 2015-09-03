var randomURL = 'https://en.wikipedia.org/w/api.php?action=query&rnnamespace=0&list=random&format=json&callback=JSON_CALLBACK';
var queryURL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&rawcontinue=true&indexpageids=true&srprop=sectiontitle&srinfo=suggestion&srsearch=';
  // Example Wiki API
  // srinfo = removes pagecount
  // srprop = removes other props besides titles
  // action=query (search)
  // srlimit = limits number of items | srsearch = searches for text
  // rawcontinue = require for API

// Our angular module that the HTML calls from
angular.module('wikiApp', [])
  // Requires both the scope and http modules
  .controller('wikiCtrl', ['$scope', '$http',
    function($scope, $http) {
      // Sets our default title and makes textsuggest hidden
      $scope.title = 'Search Wikipedia!';
      $scope.drop = false;
      $scope.loaded = false;
      $scope.limit = 10;

      // Used to save search text for moreResults call
      var searchText;

      // Function to generate random links, runs at beginning
      // and once every click
      $scope.random = function() {       
        $http.jsonp(randomURL).success(function(data) {
          $scope.randomLink = 'https://en.wikipedia.org/wiki?curid=' + data.query.random[0].id;
        });
      }

      $scope.random();

      // Our Search Function (Main function)
      $scope.searchQuery = function(text) {
        // Encodes text for Web searching
        text = encodeURI(text);

        // calls Wiki API, needs JSON_CAL... to function with $http.jsonp
        $http.jsonp(queryURL + text + '&callback=JSON_CALLBACK' + '&srlimit=' + $scope.limit).success(function(data) {
          $scope.results = data.query.search;
          $scope.title = 'Results found for "' + searchText + '".';
        });
      }

      // Used to search for most instances
      $scope.searchClick = function(item) {
        // Exits if nothing was entered
        if (item == '') {
          return;
        }
        // Stores search text in memory
        searchText = $scope.search;

        // resets limit back to 10
        $scope.limit = 10;
        $scope.title = 'Searching...';
        $scope.searchQuery(item);
        $scope.loaded = true;
      }

      // Used to display more results
      // Need to find cleaner way that doesn't need to reload page
      // each time
      $scope.moreResults = function() {
        $scope.limit += 5;
        $scope.searchQuery(searchText);
      }

      // Used for changing input box into selected suggestion
      $scope.changeText = function(text) {
        $scope.drop = false;
        $scope.search = text;
        // Searches selected item
        $scope.searchClick(text);
      }

      // Clears text
      $scope.clearText = function() {
        $scope.drop = false;
        $scope.search = '';
      }

      // Hides dropdown menu when anywhere on page is clicked
      $scope.escapeClick = function() {
        $scope.drop = false;
      }

      // Function for text suggestion
      // same as search but with a smaller limit
      $scope.suggest = function() {
        $http.jsonp(queryURL + $scope.search + '&callback=JSON_CALLBACK&srlimit=3').success(function(data) {
          $scope.dropResults = data.query.search;
          $scope.drop = true;
        });
      }
    }
  ]);

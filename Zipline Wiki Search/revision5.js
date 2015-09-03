var queryURL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&rawcontinue=true&indexpageids=true&srprop=sectiontitle&srinfo=suggestion&srsearch='
  // Example Wiki API
  // srinfo = removes pagecount
  // srprop = removes other props besides titles
  // action=query (search)
  // srlimit = limits number of items | srsearch = searches for text
  // rawcontinue = require for API

function suggestIt(searchText, items) {
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }
 
    $( ".form-control" ).autocomplete({
      source: function( request, response ) {
        $.ajax({
          url: queryURL + searchText + '&srlimit=3',
          dataType: "jsonp",
          success: function( data ) {
            return data = data.query.search.map(function(item) {
              return item.title;
            })
          }
        });
      },
      minLength: 3,
      select: function( event, ui ) {
        log( ui.item ?
          "Selected: " + ui.item.label :
          "Nothing selected, input was " + this.value);
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    });
  };

// Our angular module that the HTML calls from
angular.module('wikiApp', [])
  .controller('wikiCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.title = 'Search Wikipedia!';
      $scope.drop = false;
      
      $scope.searchClick = function() {
        $scope.title = 'Searching...';
         // Exits if nothing was entered
        if ($scope.search == '') {
          return;
        }
        // calls Wiki API, needs JSON_CAL... to function with $http.jsonp
        $http.jsonp(queryURL + $scope.search + '&callback=JSON_CALLBACK').success(function(data) {
          $scope.results = data.query.search;
          $scope.title = 'Results found for "' + $scope.search + '".';
        });
      }
      
      $scope.clickIt = function(text) {
        $('#autocomplete').val(text);
      }
      
      $scope.suggest = function() {
        console.log('Keydown');
        
        $("#autocomplete").autocomplete({
          source: function() {
            $.ajax({
              url: queryURL + $scope.search + '&srlimit=5',
              crossDomain: true,
              dataType: 'jsonp',
              type: 'POST',
              headers: { 'Api-User-Agent': 'Example/1.0' },
              success: function(data) {
                data = data.query.search
                var list = data.map(function(item){return item.title});
                $scope.drop = true;
                list.forEach(function(item) {
                  $('<option/>', {
                    id: item.replace(/[^a-z0-9]/gi, ''),
                    'ng-click': "clickIt('" + item + "')",
                    text: item,
                  }).appendTo('select'); 
                });
              }
            });
          },
          minLength: 3
        });
        
        /*
        $http.jsonp(queryURL + $scope.search + '&callback=JSON_CALLBACK').success(function(data) {
          $scope.dropResults = data.query.search;
          $scope.drop = true;
          $( ".form-control" ).autocomplete({
          source: $scope.dropResults
          });
        });
        console.log($scope.dropResults);
        */
        
        
        /*
        var availableTags = results.map(function(item) {
          return item.title;
        });
        console.log(availableTags);
        $( ".form-control" ).autocomplete({
          source: availableTags
        });
        */
      }
    }
  ]);

$('input').val() = 'hi';
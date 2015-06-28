'use strict';

angular.module('nightlifeApp')
  .controller('BarsCtrl', function ($scope, $http) {
    
  	$http.get('/api/bars/').success(function(dbBars) {

  		$scope.bars = dbBars;
  		
  	});

  });

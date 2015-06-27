'use strict';

angular.module('nightlifeApp')
.controller('MainCtrl', function ($scope, $http) {
	
	$scope.search = function() {
		if ($scope.input_location) {
			// remove everything except letters, spaces and dashes
			$scope.input_location = $scope.input_location.replace(/[^\w -]?[\d]?/g, '');

			$http.get('/api/bars/search/' + $scope.input_location)
				.success(function(data) {
					$scope.bars = data.message.businesses;
					console.log(data.message.businesses[0]);
				});
		}
	};


	$scope.input_location = 'montreal';
	$scope.search();



});

'use strict';

angular.module('nightlifeApp')
.controller('MainCtrl', function ($scope, $http, $modal, Auth) {
	
	$scope.search = function() {
		if ($scope.input_location) {
			// remove everything except letters, spaces and dashes
			$scope.input_location = $scope.input_location.replace(/[^\w -]?[\d]?/g, '');

			$http.get('/api/bars/search/' + $scope.input_location)
				.success(function(data) {
					console.log(data.message.businesses[0]);
					$scope.bars = data.message.businesses.map(function(business, index) {
						return {
							name: business.name,
							url: business.url,
							id: index
						};
					});
				});
		}
	};


	$scope.input_location = 'montreal';
	$scope.search();

	// modal
	$scope.addMe = function (id) {
		if (!Auth.isLoggedIn()) {
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'myModalContent.html',
		      controller: 'ModalInstanceCtrl'
		    });
		} else {
			if(false) {
				$http.post('/api/bars/', {
					name: $scope.bars[id].name,
					users: [Auth.getCurrentUser()]
				}).success(function(data) {
					console.log(data);
				});
			}
			
			$http.get('/api/bars/').success(function(dbBars) {
				//console.log(dbBars);
				var barId = false;
				dbBars.forEach(function(dbBar, index) {
					if (dbBar.name === $scope.bars[id].name) {
						barId = dbBar._id;
					}
				});
				
				if (barId !== false) {
					$http.put('/api/bars/' + barId, {
						
					}).success(function(data) {
						console.log('success: ', data);
					}).error(function(err) {
						console.log('error: ', err);
					});
				}
			});
		}
	};

	

});

angular.module('nightlifeApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, $location) {

  $scope.signUp = function () {
  	$location.path('/signup');
    $modalInstance.close();
  };

  $scope.login = function () {
    $location.path('/login');
    $modalInstance.close();
  };

  $scope.twitterLogin = function () {
    //$location.path('/');
    $modalInstance.close();
  };
});

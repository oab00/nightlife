'use strict';

angular.module('nightlifeApp')
.controller('MainCtrl', function ($scope, $http, $modal, Auth) {
	
	$scope.search = function() {
		if ($scope.input_location) {
			// remove everything except letters, spaces and dashes
			$scope.input_location = $scope.input_location.replace(/[^\w -]?[\d]?/g, '');

			$http.get('/api/bars/search/' + $scope.input_location)
				.success(function(data) {
					//console.log(data.message.businesses[0]);
					$scope.bars = data.message.businesses.map(function(business, index) {
						return {
							name: business.name,
							url: business.url,
							id: index,
							userIsGoing: false,
							usersList: []
						};
					});
				});
		}
	};

	$scope.updateGoing = function() {
		$http.get('/api/bars/').success(function(dbBars) {

			$scope.bars.forEach(function(bar) {
				var barIndex = dbBars.map(function(mapped) {
					return mapped.name;
				}).indexOf(bar.name);

				// for each bar in the database bars
				if (barIndex !== -1) {
					
					// update going :)

				}
			});
		});
	};


	$scope.input_location = 'montreal';
	$scope.search();

	
	$scope.addMe = function (id) {
		// if user not logged in
		if (!Auth.isLoggedIn()) {
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'myModalContent.html',
		      controller: 'ModalInstanceCtrl'
		    });

		// if logged in assign user to bar
		} else {
			var user = Auth.getCurrentUser();
			if (true) {
				$http.get('/api/bars/').success(function(dbBars) {

					// find if bar exists
					var foundBar = false;
					dbBars.forEach(function(dbBar, index) {
						if (dbBar.name === $scope.bars[id].name) {
							foundBar = dbBar;
						}
					});
					
					// if bar exists update users
					if (foundBar !== false) {

						var userExists = false;
						// find if user exists in bar
						foundBar.users.forEach(function(u) {
							if (u.email === user.email) {
								userExists = true;
							}
						});

						if (userExists === false) {
							foundBar.users.push(user);
							$http.put('/api/bars/' + foundBar._id, foundBar)
								.success(function(data) {
								console.log('new user');
							}).error(function(err) {
								console.log('error: ', err);
							});
						} else {
							console.log('user exists');
						}
					}

					// if not make a new bar
					else {
						$http.post('/api/bars/', {
							name: $scope.bars[id].name,
							users: [user]
						}).success(function(data) {
							console.log('new bar');
						});
					}
				});
			}
		}
	};

	$scope.removeMe = function(id) {

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

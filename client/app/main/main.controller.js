'use strict';

angular.module('nightlifeApp')
.controller('MainCtrl', function ($scope, $http, $modal, Auth) {

	var user = Auth.getCurrentUser();
	
	$scope.search = function() {
		
		if ($scope.inputLocation) {
			// remove everything except letters, spaces and dashes
			$scope.inputLocation = $scope.inputLocation.replace(/[^\w -]?[\d]?/g, '');

			$scope.loading = true;

			localStorage.setItem('location', $scope.inputLocation);

			$http.get('/api/bars/search/' + $scope.inputLocation)
				.success(function(data) {
					$scope.bars = data.message.businesses.map(function(business, index) {
						return {
							name: business.name,
							city: business.location.city,
							url: business.url,
							id: index,
							userIsGoing: false,
							usersList: [],
							dbIndex: undefined,
							dbId: undefined
						};
					});
					$scope.updateGoing();
					$scope.notFound = false;
					$scope.loading = false;
				}).error(function() {
					$scope.notFound = true;
					$scope.loading = false;
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

					bar.usersList = dbBars[barIndex].users;

					bar.userIsGoing = false;
					bar.usersList.forEach(function(u) {
						if (u.email === user.email) {
							bar.userIsGoing = true;
						}
					});

					bar.dbIndex = barIndex;
					bar.dbId = dbBars[barIndex]._id;

				}
			});
		});
	};


	//$scope.inputLocation = 'montreal';
	//$scope.search();

	
	$scope.addMe = function (id) {
		// if user not logged in
		if (!Auth.isLoggedIn()) {
		    $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'myModalContent.html',
		      controller: 'ModalInstanceCtrl'
		    });

		// if logged in assign user to bar
		} else {
			$http.get('/api/bars/').success(function(dbBars) {

				// find if bar exists
				var foundBar = false;
				dbBars.forEach(function(dbBar) {
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

					// include user
					if (userExists === false) {
						foundBar.users.push(user);
						$http.put('/api/bars/' + foundBar._id, foundBar)
							.success(function() {
								$scope.updateGoing();
						});
					}
				}

				// if not make a new bar and include user
				else {
					$http.post('/api/bars/', {
						name: $scope.bars[id].name,
						city: $scope.bars[id].city,
						url: $scope.bars[id].url,
						users: [user]
					}).success(function() {
						$scope.updateGoing();
					});
				}
			});
		}
	};

	$scope.removeMe = function(id) {

		$http.get('/api/bars/' + $scope.bars[id].dbId).success(function(dbBar) {

			var removeIndex = dbBar.users.map(function(u) { return u.email; }).indexOf(user.email);

			dbBar.users.splice(removeIndex, 1);
			
			$http.put('/api/bars/' + dbBar._id, dbBar)
				.success(function() {
					$scope.updateGoing();
			});
		});

		$scope.updateGoing();
	};


	function startUp() {
		if (localStorage.getItem('location')) {
			$scope.inputLocation = localStorage.getItem('location');
			$scope.search();
		}
	}
	
	setTimeout(startUp, 1000);

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

  // TODO: twitter login
  $scope.twitterLogin = function () {
    //$location.path('/');
    $modalInstance.close();
  };
});

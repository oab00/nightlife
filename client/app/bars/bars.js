'use strict';

angular.module('nightlifeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/bars', {
        templateUrl: 'app/bars/bars.html',
        controller: 'BarsCtrl'
      });
  });

'use strict';

angular.module('apidiffApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'ui.ace'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('/:api', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('/:api/:view', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
  });

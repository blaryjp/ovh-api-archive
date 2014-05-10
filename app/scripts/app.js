/**
 * ovh-api-archive: View or compare an API archive from OVH, SYS, KS, or RunAbove.
 *
 * @author Jean-Philippe Blary (@blary_jp)
 * @url https://github.com/blaryjp/ovh-api-archive
 * @license MIT
 */
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

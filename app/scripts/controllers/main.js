'use strict';

angular.module('apidiffApp').controller('MainCtrl', function ($scope, $routeParams) {
    $scope.currentApi = $routeParams.api;
    $scope.currentView = $routeParams.view;
});

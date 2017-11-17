/**
 * ovh-api-archive: View or compare an API archive from OVH, SYS, KS, and RunAbove.
 *
 * @author Jean-Philippe Blary (@blary_jp)
 * @url https://github.com/blaryjp/ovh-api-archive
 * @license MIT
 */
'use strict';

angular.module('apidiffApp').controller('MainCtrl', function ($scope, $routeParams, $location, Dataset) {

    if (($routeParams.api && !~['ovh-eu', 'ovh-ca', 'ovh-us', 'sys', 'ks', 'ra'].indexOf($routeParams.api)) ||
        ($routeParams.view && !~['archive', 'diff'].indexOf($routeParams.view))) {
        $location.path('/');
    } else {
        $scope.currentApi = $routeParams.api;
        $scope.currentView = $routeParams.view;
    }

    // Get the date of the last snapshot taken
    Dataset.getLastSnapshotDate().then(function (lastSnapshot) {
        $scope.lastSnapshot = lastSnapshot;
    });

});

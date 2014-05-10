/**
 * ovh-api-archive: View or compare an API archive from OVH, SYS, KS, and RunAbove.
 *
 * @author Jean-Philippe Blary (@blary_jp)
 * @url https://github.com/blaryjp/ovh-api-archive
 * @license MIT
 */
'use strict';

angular.module('apidiffApp')
  .controller('AppCtrl', function ($scope) {
    $scope.currentApi = null;
    $scope.currentView = null;
  });

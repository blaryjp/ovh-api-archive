/**
 * ovh-api-archive: View or compare an API archive from OVH, SYS, KS, and RunAbove.
 *
 * @author Jean-Philippe Blary (@blary_jp)
 * @url https://github.com/blaryjp/ovh-api-archive
 * @license MIT
 */
'use strict';

angular.module('apidiffApp').controller('DiffCtrl', function ($scope, $q, $location, Dataset) {

    $scope.model = {};
    $scope.data = {};
    $scope.loading = {};

    var diffpatcher = jsondiffpatch.create({
        objectHash: function (obj) {
            return obj.id || obj.name || obj.description;
        }
    });

    // User select a "to" date
    $scope.selectTo = function () {
        setFromDateToYesterday();
        fetchDatas().then(function () {
            $location.search('to', $scope.model.to);
        });
    };

    // User select a "from" date
    $scope.selectFrom = function () {
        if (moment($scope.model.from).isBefore($scope.model.to)) {
            fetchDatas().then(function () {
                $location.search('from', $scope.model.from);
            });
        }
    };

    function setFromDateToYesterday () {
        $scope.customFrom = false;
        $scope.model.from = moment($scope.model.to).subtract('day', 1).format('YYYY-MM-DD');
        $location.search('from', null);
    }

    function fetchDatas () {
        $scope.model.api = null;
        $scope.data.apis = null;
        $('#tree-diff').empty();

        $scope.loading.diff = true;

        return Dataset.getApiList($scope.model.to).then(function (apis) {

            var output = [],
                mainQueue = [],
                queue = [],
                path;

            angular.forEach(apis, function (api) {
                queue = [];
                path = api.match(/\/(\w+)$/)[1];

                queue.push(Dataset.getApi($scope.model.from, path).then(function (result) {
                    return JSON.stringify(result);
                }));
                queue.push(Dataset.getApi($scope.model.to, path).then(function (result) {
                    return JSON.stringify(result);
                }));

                mainQueue.push($q.all(queue).then(function (result) {
                    if (result[0] !== result[1]) {
                        output.push(api);
                    }
                }));
            });

            return $q.all(mainQueue).then(function () {
                $scope.data.apis = output;

                if ($location.search().api && ~output.indexOf($location.search().api)) {
                    $scope.model.api = $location.search().api;
                } else {
                    $location.search('api', null);
                }

                $scope.loading.diff = false;
            });
        });
    }

    $scope.$watch('model.api', function (selectedApi) {
        if (selectedApi && /\/\w+$/.test(selectedApi)) {

            var queue = [],
                from, to, delta,
                path = selectedApi.match(/\/(\w+)$/)[1];

            queue.push(Dataset.getApi($scope.model.to, path).then(function (result) {
                to = result;
            }));
            queue.push(Dataset.getApi($scope.model.from, path).then(function (result) {
                from = result;
            }));

            return $q.all(queue).then(function () {
                delta = diffpatcher.diff(from, to);
                $('#tree-diff').html(jsondiffpatch.formatters.html.format(delta, to));
                $location.search('api', selectedApi);
            });
        }
    });

    $scope.$watch('hideUnchanged', function () {
        if ($scope.hideUnchanged === 'yep') {
            jsondiffpatch.formatters.html.hideUnchanged();
        } else {
            jsondiffpatch.formatters.html.showUnchanged();
        }
    });


    function init () {
        var queue = [];
        $scope.loading.init = true;
        queue.push(Dataset.getDiffDates().then(function (result) {
            $scope.data.diffDates = result;
        }));
        queue.push(Dataset.getAllDates().then(function (result) {
            $scope.data.allDates = result;
        }));

        $q.all(queue).then(function () {
            if ($location.search().to && ~$scope.data.diffDates.indexOf($location.search().to)) {
                $scope.model.to = $location.search().to;
            } else {
                $location.search('to', null);
            }
            if ($location.search().from && ~$scope.data.allDates.indexOf($location.search().from) &&
                $scope.model.to && moment($location.search().from).isBefore($location.search().to)) {
                $scope.customFrom = true;
                $scope.model.from = $location.search().from;
            } else if ($scope.model.to) {
                setFromDateToYesterday();
            } else {
                $location.search('from', null);
            }

            if ($scope.model.to) {
                fetchDatas();
            }

            $scope.loading.init = false;
        });
    }

    init();

});

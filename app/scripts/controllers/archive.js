'use strict';

angular.module('apidiffApp').controller('ArchiveCtrl', function ($scope, $location, Dataset) {

    $scope.model = {};
    $scope.data = {};
    $scope.loading = {};

    $scope.$watch('model.date', function (selectedDate) {
        if (selectedDate) {
            $scope.data.apis = null;
            $scope.data.tree = null;
            $scope.model.api = null;
            Dataset.getApiList(selectedDate).then(function (result) {
                $scope.data.apis = result;
                $location.search('date', selectedDate);

                if ($location.search().api && ~result.indexOf($location.search().api)) {
                    $scope.model.api = $location.search().api;
                } else {
                    $location.search('api', null);
                }
            });
        }
    });

    $scope.$watch('model.api', function (selectedApi) {
        if (selectedApi && /\/\w+$/.test(selectedApi)) {
            $scope.loading.tree = true;
            Dataset.getApi($scope.model.date, selectedApi.match(/\/(\w+)$/)[1]).then(function (result) {
                $scope.data.tree = JSON.stringify(result, null, 4);
                $location.search('api', selectedApi);
                $scope.loading.tree = false;
            });
        }
    });

    $scope.loading.init = true;
    Dataset.getAllDates().then(function (result) {

        $scope.data.dates = result;

        if ($location.search().date && ~result.indexOf($location.search().date)) {
            $scope.model.date = $location.search().date;
        } else {
            $location.search('date', null);
        }

        $scope.loading.init = false;
    });

    $scope.aceLoaded = function(_editor) {
        _editor.renderer.setShowPrintMargin(false);
    };
});

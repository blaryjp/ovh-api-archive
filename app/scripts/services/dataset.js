/**
 * ovh-api-archive: View or compare an API archive from OVH, SYS, KS, or RunAbove.
 *
 * @author Jean-Philippe Blary (@blary_jp)
 * @url https://github.com/blaryjp/ovh-api-archive
 * @license MIT
 */
'use strict';

angular.module('apidiffApp').service('Dataset', function Dataset ($http, $routeParams) {

    var BASE_URL_DATASET = '';

    this.getApiList = function (date) {
        return $http.get(BASE_URL_DATASET + 'dataset/' + $routeParams.api + '/' + date + '/API.json', { cache: true }).then(function (result) {
            var apis = [];
            angular.forEach(result.data.apis, function (api) {
                apis.push(api.path);
            });
            return apis.sort();
        });
    };

    this.getApi = function (date, api) {
        return $http.get(BASE_URL_DATASET + 'dataset/' + $routeParams.api + '/' + date + '/' + api + '.json', { cache: true }).then(function (result) {
            return result.data;
        }, function (error) {
            if (error.status === 404) {     // New API
                return {};
            }
        });
    };

    this.getAllDates = function () {
        return $http.get(BASE_URL_DATASET + 'dataset/' + $routeParams.api + '/all.json', {
            params: { '_' : Date.now() }
        }).then(function (data) {
            return data.data;
        });
    };

    this.getDiffDates = function () {
        return $http.get(BASE_URL_DATASET + 'dataset/' + $routeParams.api + '/diff.json', {
            params: { '_' : Date.now() }
        }).then(function (data) {
            return data.data;
        });
    };

});

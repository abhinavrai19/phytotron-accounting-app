'use strict';

angular.module('phytotronAccountingApp')
    .factory('ChamberUsageReportService',['$http', function($http){
        return {

            // get chambers usage across projects between selected dates
            getChamberUsageBetweenDates: function (reportParams){
                return $http.post('/usageReport/chamber/byDate',reportParams);
            }
        };
    }]);
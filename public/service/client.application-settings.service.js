'use strict'
angular.module('phytotronAccountingApp')
    .factory('ApplicationSettingsService',['$http',function($http){
        return{

            // Fetch current settings from the server
            getApplicationSettings: function () {
                return $http.get('/applicationSettings');
            },

            // Update current settings to the server
            setApplicationSettings: function (applicationSettings) {
                return $http.post('/applicationSettings',applicationSettings);
            }
        }
    }]);
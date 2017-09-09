'use strict';

angular.module('phytotronAccountingApp')
    .factory('ChamberService',['$http',function($http){
        return {
            // Get all chambers
            getChamberList: function(){
                return $http.get('/chambers');
            },

            //Get a chamber by name
            getChamberByName: function(chamberName){
                return $http.get('/chamber/'+chamberName);
            },

            //Create a chamber
            createChamber: function(chamber){
                return $http.post('/chamber/create',chamber);
            },

            //update an existing chamber
            updateChamber: function(chamber){
                return $http.post('/chamber/update',chamber);
            }
        };
    }]);
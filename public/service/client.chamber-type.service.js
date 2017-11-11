'use strict';

angular.module('phytotronAccountingApp')
    .factory('ChamberTypeService',['$http',function($http){
        return {
            // Get all chamber types
            getChamberTypeList: function(){
                return $http.get('/chamberTypes');
            },

            //Get a chamber Type by name
            getChamberTypeByName: function(chamberTypeName){
                return $http.get('/chamberType/'+chamberTypeName);
            },

            //Create a chamber Type
            createChamberType: function(chamberType){
                return $http.post('/chamberType/create',chamberType);
            },

            //update an existing chamber Type
            updateChamberType: function(chamberType){
                return $http.post('/chamberType/update',chamberType);
            }
        };
    }]);
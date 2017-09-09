'use strict';

angular.module('phytotronAccountingApp')
    .factory('CropService', ['$http', function($http){
        return {

            // Get all Crops
            getCropList: function(){
                return $http.get('/crops');
            },

            //Get Crop by name
            getCropByScientificName: function(cropScientificName){
                return $http.get('/crop/'+cropScientificName);
            },

            //create a Crop
            createCrop: function(crop){
                return $http.post('/crop/create',crop);
            },

            //update a Crop
            updateCrop: function(crop){
                return $http.post('/crop/update',crop);
            }

        };

    }]);
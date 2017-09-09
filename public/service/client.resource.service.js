'use strict';

angular.module('phytotronAccountingApp')
    .factory('ResourceService', ['$http', function($http){
        return {

            // Get all Resources
            getResourceList: function(){
                return $http.get('/resources');
            },

            //Get Resource by name
            getResourceByName: function(resourceName){
                return $http.get('/resource/'+resourceName);
            },

            //create a Resource
            createResource: function(resource){
                return $http.post('/resource/create',resource);
            },

            //update a Resource
            updateResource: function(resource){
                return $http.post('/resource/update',resource);
            }

        };


    }]);
'use strict';

angular.module('phytotronAccountingApp')
    .factory('ClientService', ['$http', function($http){
        return {
            // Get all Clients
            getClientList: function(){
                return $http.get('/clients');
            },

            //Get a Client by Id
            getClientById: function(clientId){
                return $http.get('/client/'+clientId);
            },

            //Create a Client
            createClient: function(client){
                return $http.post('/client/create',client);
            },

            //update an existing Client
            updateClient: function(client){
                return $http.post('/client/update',client);
            }
        };
    }]);
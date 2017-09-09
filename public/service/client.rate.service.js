'use strict';

angular.module('phytotronAccountingApp')
    .factory('RateService', ['$http', function($http){
        return {

            // Get all Rates
            getRateList: function(){
                return $http.get('/rates');
            },

            //Get Rate by type
            getRateByType: function(rateType){
                return $http.get('/rate/'+rateType);
            },

            //create a rate
            createRate: function(rate){
                return $http.post('/rate/create',rate);
            },

            //update a rate
            updateRate: function(rate){
                return $http.post('/rate/update',rate);
            }

        };


    }]);
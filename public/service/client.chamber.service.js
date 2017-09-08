'use strict';

angular.module('phytotronAccountingApp')
    .factory('ChamberService',['$http',function($http){
        return{
            getChamberList: function(){
                return $http.get('/chambers');
            },
            getChamberByName: function(chamberName){
                return $http.get('/chamber/'+chamberName);
            },
            createChamber: function(chamber){
                return $http.post('/chamber/',chamber);
            },
            updateChamber: function(chamberName,chamber){
                return $http.post('/chamber/'+chamberName,chamber);
            }
        }
    }]);
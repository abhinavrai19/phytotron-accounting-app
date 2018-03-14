'use strict'

angular.module('phytotronAccountingApp')
    .factory('UserService',['$http',function($http){
        return {

            loginUser: function(user){
              return $http.post('/login',user);
            },

            logoutUser: function(user){
                return $http.post('/logout',user);
            }
        };
    }]);
'use strict'

angular.module('phytotronAccountingApp')
    .factory('AuthenticationInterceptor',function ($location) {
        return {
            responseError: function(res){
            if(res.status==401 || res.status ==419){
                $location.path('/');
            }
            return res;
            }
        }
    });
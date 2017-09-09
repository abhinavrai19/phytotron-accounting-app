'use strict';
angular.module('phytotronAccountingApp').
    component('topNavigationBar',{
        templateUrl: 'top-navigation-bar/client.top-navigation-bar.template.html',
        controller: function TopNavigationBarController($location){

            this.navigateTo = function(locationPath){
                $location.path(locationPath);
            }
        }
});
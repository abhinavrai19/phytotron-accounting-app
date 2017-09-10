'use strict';
angular.module('phytotronAccountingApp').
    component('topInformationBar',{
        templateUrl: 'top-information-bar/client.top-information-bar.template.html',
        controller: function TopInformationBarController($location){

            var ctrl = this;

            ctrl.logoutCurrentUser = function (){
                $location.path('/');
            };
        }
});
'use strict';
angular.module('phytotronAccountingApp').
    component('topInformationBar',{
        templateUrl: 'top-information-bar/client.top-information-bar.template.html',
        controller: function TopInformationBarController(){

            this.logoutCurrentUser = function (){
                console.log("User logged out");
            };
        }
});
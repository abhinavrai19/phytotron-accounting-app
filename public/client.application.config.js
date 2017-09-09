'use strict';

// Configure the urls to respective components : using ngRoute
angular.module('phytotronAccountingApp')
    .config(['$routeProvider', '$locationProvider',
    function config($routeProvider,$locationProvider){
        $locationProvider.hashPrefix('');

        $routeProvider
            .when('/',{
                template: '<login-page></login-page>'
            })
            .when('/home-page',{
                template: '<home-page></home-page>'
            })
            .when('/chamber-list',{
                template: '<chamber-list-page></chamber-list-page>'
            })
            .when('/chamber-update/:id',{
                template: '<chamber-update-page></chamber-update-page>'
            });
}]);


// Configure Flash Message
angular.module('phytotronAccountingApp')
    .config( function(FlashProvider) {
        FlashProvider.setTimeout(5000);
        FlashProvider.setShowClose(true);
});


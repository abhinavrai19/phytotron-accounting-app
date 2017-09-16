'use strict';

// Configure the urls to respective components : using ngRoute
angular.module('phytotronAccountingApp')
    .config(['$routeProvider', '$locationProvider',
    function config($routeProvider,$locationProvider){
        $locationProvider.hashPrefix('');

        // URL-Component mappings: home and login
        $routeProvider
            .when('/',{
                template: '<login-page></login-page>'
            })
            .when('/home',{
                template: '<home-page></home-page>'
            });

        // URL-Component mappings: project
        $routeProvider
            .when('/project-list', {
                template: '<project-list-page></project-list-page>'
            })
            .when('/project-update/:id', {
                template: '<project-update-page></project-update-page>'
            });

        // URL-Component mappings: client
        $routeProvider
            .when('/client-list',{
                template: '<client-list-page></client-list-page>'
            })
            .when('/client-update/:id',{
                template: '<client-update-page></client-update-page>'
            });

        // URL-Component mappings: space usage parameters
        $routeProvider
            .when('/chamber-list',{
                template: '<chamber-list-page></chamber-list-page>'
            })
            .when('/chamber-update/:id',{
                template: '<chamber-update-page></chamber-update-page>'
            })
            .when('/rate-list',{
                template: '<rate-list-page></rate-list-page>'
            })
            .when('/rate-update/:id',{
                template: '<rate-update-page></rate-update-page>'
            })
            .when('/department-list',{
                template: '<department-list-page></department-list-page>'
            })
            .when('/department-update/:id',{
                template: '<department-update-page></department-update-page>'
            })
            .when('/crop-list',{
                template: '<crop-list-page></crop-list-page>'
            })
            .when('/crop-update/:id',{
                template: '<crop-update-page></crop-update-page>'
            })
            .when('/resource-list',{
                template: '<resource-list-page></resource-list-page>'
            })
            .when('/resource-update/:id',{
                template: '<resource-update-page></resource-update-page>'
            });

        // URL-Component mappings: Chamber Usage
        $routeProvider
            .when('/chamber-usage',{
                template:'<chamber-usage-page></chamber-usage-page>'
            });
}]);


// Configure Flash Message
angular.module('phytotronAccountingApp')
    .config( function(FlashProvider) {
        FlashProvider.setTimeout(5000);
        FlashProvider.setShowClose(true);
});


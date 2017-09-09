'use strict';
angular.module('phytotronAccountingApp')
    .component('resourceUpdatePage',{
        templateUrl: 'resource-update-page/client.resource-update-page.template.html',
        controller: function ResourceUpdatePageController($routeParams,ResourceService,Flash){
            var ctrl = this;

            ctrl.$onInit = function(){
                //Get current chamber details
                ResourceService.getResourceByName($routeParams.id)
                    .then(function success(res){
                        ctrl.resource = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            ctrl.updateResource = function(){
                ResourceService.updateResource(ctrl.resource)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }
        }
    });
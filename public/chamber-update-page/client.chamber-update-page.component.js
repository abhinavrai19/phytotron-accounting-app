'use strict';
angular.module('phytotronAccountingApp')
    .component('chamberUpdatePage',{
        templateUrl: 'chamber-update-page/client.chamber-update-page.template.html',
        controller: function ChamberUpdatePageController($routeParams,ChamberService,Flash){
            var ctrl = this;

            ctrl.chamber = {
                chamber_name: "",
                carts_count: ""
            };

            ctrl.$onInit = function(){
                //Get current chamber details
                ChamberService.getChamberByName($routeParams.id)
                    .then(function success(res){
                        ctrl.chamber = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            ctrl.updateChamber = function(){
                ChamberService.updateChamber(ctrl.chamber)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }
        }
    });
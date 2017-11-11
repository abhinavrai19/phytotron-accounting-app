'use strict';
angular.module('phytotronAccountingApp')
    .component('chamberUpdatePage',{
        templateUrl: 'chamber-update-page/client.chamber-update-page.template.html',
        controller: function ChamberUpdatePageController($routeParams,
                                                         ChamberService,
                                                         ChamberTypeService,
                                                         Flash){
            var ctrl = this;

            ctrl.$onInit = function(){

                ctrl.getAllChamberTypes();

                //Get current chamber details
                ChamberService.getChamberByName($routeParams.id)
                    .then(function success(res){
                        ctrl.chamber = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.getAllChamberTypes = function () {
                // Get all Chamber Types
                ChamberTypeService.getChamberTypeList()
                    .then(function success(res) {
                        ctrl.chamberTypeList = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });

            };

            ctrl.updateChamber = function(){
                ChamberService.updateChamber(ctrl.chamber)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            };

        }
    });
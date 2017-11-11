'use strict';
angular.module('phytotronAccountingApp')
    .component('chamberTypeUpdatePage',{
        templateUrl: 'chamber-type-update-page/client.chamber-type-update-page.template.html',
        controller: function ChamberTypeUpdatePageController($routeParams,
                                                             ChamberTypeService,
                                                             Flash){
            var ctrl = this;

            ctrl.$onInit = function(){
                //Get current chamber details
                ChamberTypeService.getChamberTypeByName($routeParams.id)
                    .then(function success(res){
                        ctrl.chamberType = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            ctrl.updateChamberType = function(){
                ChamberTypeService.updateChamberType(ctrl.chamberType)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }
        }
    });
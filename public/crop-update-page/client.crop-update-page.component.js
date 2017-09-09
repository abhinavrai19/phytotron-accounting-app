'use strict';
angular.module('phytotronAccountingApp')
    .component('cropUpdatePage',{
        templateUrl: 'crop-update-page/client.crop-update-page.template.html',
        controller: function CropUpdatePageController($routeParams,CropService,Flash){
            var ctrl = this;

            ctrl.$onInit = function(){
                //Get current crop details
                CropService.getCropByScientificName($routeParams.id)
                    .then(function success(res){
                        ctrl.crop = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            ctrl.updateCrop = function(){
                CropService.updateCrop(ctrl.crop)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }
        }
    });
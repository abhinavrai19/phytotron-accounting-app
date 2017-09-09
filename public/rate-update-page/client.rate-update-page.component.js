'use strict';
angular.module('phytotronAccountingApp')
    .component('rateUpdatePage',{
        templateUrl: 'rate-update-page/client.rate-update-page.template.html',
        controller: function RateUpdatePageController($routeParams,RateService,Flash){
            var ctrl = this;

            ctrl.$onInit = function(){
                //Get current chamber details
                RateService.getRateByType($routeParams.id)
                    .then(function success(res){
                        ctrl.rate = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            ctrl.updateRate = function(){
                RateService.updateRate(ctrl.rate)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }
        }
    });
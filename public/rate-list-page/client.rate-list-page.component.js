angular.module('phytotronAccountingApp')
    .component('rateListPage',{
        templateUrl: 'rate-list-page/client.rate-list-page.template.html',
        controller: function RateListPageController(RateService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'chamber_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getRateList();
            };

            ctrl.getRateList = function(){
                RateService.getRateList()
                    .then(function success(res){
                        ctrl.rateList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.addRate = function(){
                RateService.createRate(ctrl.newRate)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getRateList();
                        ctrl.newRate = {};
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            }
        }
    });
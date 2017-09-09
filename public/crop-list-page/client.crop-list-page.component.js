angular.module('phytotronAccountingApp')
    .component('cropListPage',{
        templateUrl: 'crop-list-page/client.crop-list-page.template.html',
        controller: function CropListPageController(CropService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'common_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getCropList();
            };

            ctrl.getCropList = function(){
                CropService.getCropList()
                    .then(function success(res){
                        ctrl.cropList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.addCrop = function(){
                CropService.createCrop(ctrl.newCrop)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getCropList();
                        ctrl.newCrop = {};
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            }
        }
    });
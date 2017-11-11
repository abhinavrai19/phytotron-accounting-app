angular.module('phytotronAccountingApp')
    .component('chamberTypeListPage',{
        templateUrl: 'chamber-type-list-page/client.chamber-type-list-page.template.html',
        controller: function ChamberTypeListPageController( ChamberTypeService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'chamber_type_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getAllChamberTypes();
            }

            ctrl.getAllChamberTypes = function(){
                // Get all chambers
                ChamberTypeService.getChamberTypeList()
                    .then(function success(res){
                        ctrl.chamberTypeList = (res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.addChamberType = function(){
                ChamberTypeService.createChamberType(ctrl.newChamberType)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getAllChamberTypes();
                        ctrl.newChamberType = {};
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }
        }
});
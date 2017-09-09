angular.module('phytotronAccountingApp')
    .component('chamberListPage',{
        templateUrl: 'chamber-list-page/client.chamber-list-page.template.html',
        controller: function ChamberListPageController( ChamberService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'chamber_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getAllChambers();
            }

            ctrl.getAllChambers = function(){
                // Get all chambers
                ChamberService.getChamberList()
                    .then(function success(res){
                        ctrl.chambersList = (res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.addChamber = function(){
                ChamberService.createChamber(ctrl.newChamber)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getAllChambers();
                        ctrl.newChamber = {};
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }
        }
});
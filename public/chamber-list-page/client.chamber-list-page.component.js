angular.module('phytotronAccountingApp')
    .component('chamberListPage',{
        templateUrl: 'chamber-list-page/client.chamber-list-page.template.html',
        controller: ['ChamberService', function ChamberListPageController(ChamberService){
            var ctrl = this;

            ctrl.$onInit = function(){

                // Get all chambers
                ChamberService.getChamberList()
                    .then(function success(res){
                        ctrl.chambersList = (res.data);
                    }, function failure(res){
                        alert(res.data);
                    });
            }
        }]
});
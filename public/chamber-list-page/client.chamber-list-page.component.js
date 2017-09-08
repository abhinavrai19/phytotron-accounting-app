angular.module('phytotronAccountingApp').
    component('chamberList',{
        templateUrl: 'chamber-list-page/client.chamber-list-page.template.html',
        controller: ['ChamberService', function ChamberListController(ChamberService){
            var ctrl = this;

            ctrl.$onInit = function(){
                // Get all chambers
                ChamberService.getChamberList()
                    .then(function success(res){
                        ctrl.chambersList = (res.data);
                        console.log("chamber-list-page-controller"+ctrl.chambersList);
                    }, function failure(res){
                        alert(res.data);
                    });
            }

        }]
});
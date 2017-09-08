'use strict';
angular.module('phytotronAccountingApp')
    .component('chamberUpdatePage',{
        templateUrl: 'chamber-update-page/client.chamber-update-page.template',
        controller: ['ChamberService', function ChamberUpdatePageController(ChamberService){
            var ctrl = this;
        }]
    });
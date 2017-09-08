'use strict';
angular.module('phytotronAccountingApp')
    .component('chamberAddPage',{
        templateUrl: 'chamber-add-page/client.chamber-add-page.template',
        controller: ['ChamberService', function ChamberAddPageController(ChamberService){
            var ctrl = this;
        }]
    });
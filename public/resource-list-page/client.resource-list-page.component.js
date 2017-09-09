angular.module('phytotronAccountingApp')
    .component('resourceListPage',{
        templateUrl: 'resource-list-page/client.resource-list-page.template.html',
        controller: function ResourceListPageController(ResourceService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'resource_name',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getResourceList();
            };

            ctrl.getResourceList = function(){
                ResourceService.getResourceList()
                    .then(function success(res){
                        ctrl.resourceList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.addResource = function(){
                ResourceService.createResource(ctrl.newResource)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getResourceList();
                        ctrl.newResource = {};
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            }
        }
    });
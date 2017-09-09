angular.module('phytotronAccountingApp')
    .component('departmentListPage',{
        templateUrl: 'department-list-page/client.department-list-page.template.html',
        controller: function DepartmentListPageController(DepartmentService, Flash){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'department_id',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function(){
                ctrl.getDepartmentList();
            };

            ctrl.getDepartmentList = function(){
                DepartmentService.getDepartmentList()
                    .then(function success(res){
                        ctrl.departmentList = res.data;
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.addDepartment = function(){
                DepartmentService.createDepartment(ctrl.newDepartment)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        ctrl.getDepartmentList();
                        ctrl.newDepartment = {};
                    },function failure(res){
                        Flash.create('danger',res.data);
                    });
            }
        }
    });
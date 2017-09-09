'use strict';
angular.module('phytotronAccountingApp')
    .component('departmentUpdatePage',{
        templateUrl: 'department-update-page/client.department-update-page.template.html',
        controller: function DepartmentUpdatePageController($routeParams,DepartmentService,Flash){
            var ctrl = this;

            ctrl.$onInit = function(){
                //Get current chamber details
                DepartmentService.getDepartmentById($routeParams.id)
                    .then(function success(res){
                        ctrl.department = res.data;
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            }

            ctrl.updateDepartment = function(){
                DepartmentService.updateDepartment(ctrl.department)
                    .then(function success(res){
                        Flash.create('success',res.data);
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    })
            }
        }
    });
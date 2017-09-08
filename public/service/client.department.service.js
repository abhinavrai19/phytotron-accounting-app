'use strict';

angular.module('phytotronAccountingApp')
    .factory('DepartmentService', ['$http', function($http){
        return {

            // Get all Departments
            getAllDepartments: function(){
                return $http.get('/department');
            },

            //Get Department by name
            getDepartmentById: function(departmentId){
                return $http.get('/department/'+departmentId);
            },

            //create a Department
            createDepartment: function(department){
                return $http.post('/department/create',department);
            },

            //update a Department
            updateDepartment: function(departmentId, department){
                return $http.post('/department/update/'+departmentId,department);
            }

        };

    }]);
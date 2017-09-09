'use strict';

angular.module('phytotronAccountingApp')
    .factory('DepartmentService', ['$http', function($http){
        return {

            // Get all Departments
            getDepartmentList: function(){
                return $http.get('/departments');
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
            updateDepartment: function(department){
                return $http.post('/department/update',department);
            }

        };

    }]);
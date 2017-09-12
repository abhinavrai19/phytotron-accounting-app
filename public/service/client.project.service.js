'use strict';

angular.module('phytotronAccountingApp')
    .factory('ProjectService', ['$http', function($http){
        return {

            // Get all Projects
            getProjectList: function(){
                return $http.get('/projects');
            },

            //Get Project by Id
            getProjectById: function(projectId){
                return $http.get('/project/'+projectId);
            },

            //create Project
            createProject: function(project){
                return $http.post('/project/create',project);
            },

            //update Project
            updateProject: function(project){
                return $http.post('/project/update',project);
            }

        };

    }]);
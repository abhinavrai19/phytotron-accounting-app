'user strict'

angular.module('phytotronAccountingApp')
    .factory('NoteService',['$http',function($http){
        return {
            // get list of all notes
            getNoteList: function () {
                return $http.get('/notes');
            },

            // Create a new note
            createNote: function (note) {
                return $http.post('/note/create',note);
            },

            // Update an existing note
            updateNote: function (note) {
                return $http.post('/note/update',note);
            },

            // Remove a note
            deleteNote: function (note) {
                return $http.post('/note/delete',note);
            }
        };
    }]);
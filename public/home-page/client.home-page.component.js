'use strict';
angular.module('phytotronAccountingApp').
    component('homePage',{
        templateUrl: 'home-page/client.home-page.template.html',
        controller: function HomePageController(
            NoteService,
            moment,
            Flash,
            user
        ){
            var ctrl = this;

            // Parameters for table pagination
            ctrl.tableQuery = {
                order: 'created_on',
                limit: 10,
                page: 1
            };

            ctrl.$onInit = function () {
                ctrl.noteList = [];
                ctrl.note_content = '';
                ctrl.getNoteList();
            };

            // Get list of all the notes
            ctrl.getNoteList = function () {
                NoteService.getNoteList()
                    .then(function success(res) {
                        if(res.status===200){
                            ctrl.noteList = res.data;
                            ctrl.noteList.forEach(function (note) {
                                note.created_on = moment(note.created_on);
                            });
                        }
                    }, function failure(res) {
                        Flash.create('danger',res.data);
                    });
            };

            // Create a new note
            ctrl.createNote = function () {
                // If the note content is empty, alert that note content cannot be null
                if(ctrl.note_content !==''){

                    ctrl.newNote = {
                        content: ctrl.note_content,
                        created_by: user.username,
                        created_on: moment()
                    };

                    NoteService.createNote(ctrl.newNote)
                        .then(function success(res) {
                            ctrl.$onInit();
                            Flash.create('success', res.data);
                        }, function failure(res) {
                            Flash.create('danger',res.data)
                        });
                }else{
                    Flash.create('danger','Note content cannot be empty');
                }
            }; // end of create new note

            ctrl.deleteNote = function (note) {
                NoteService.deleteNote(note)
                    .then(function success(res) {
                        ctrl.getNoteList();
                        Flash.create('success',res.data);
                    },function failure(res) {
                        Flash.create('danger',res.data);
                    })
            };// end of delete note
        }
});
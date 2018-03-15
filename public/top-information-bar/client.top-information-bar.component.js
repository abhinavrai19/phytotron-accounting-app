'use strict';
angular.module('phytotronAccountingApp').
    component('topInformationBar',{
        templateUrl: 'top-information-bar/client.top-information-bar.template.html',
        controller: function TopInformationBarController(UserService,Flash,$location){

            var ctrl = this;

            // For now empty user is sent, as the service does not require a user object to logout.
            ctrl.user = {
                username: ''
            };

            ctrl.logoutCurrentUser = function (){
                UserService.logoutUser(ctrl.user)
                    .then(function success(res) {
                        Flash.create('success',res.data);
                        $location.path('/');
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });

            };
        }
});
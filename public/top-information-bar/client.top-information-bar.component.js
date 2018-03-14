'use strict';
angular.module('phytotronAccountingApp').
    component('topInformationBar',{
        templateUrl: 'top-information-bar/client.top-information-bar.template.html',
        controller: function TopInformationBarController(UserService,Flash,$location, user){

            var ctrl = this;

            ctrl.user = {
                username: user.username
            };

            ctrl.logoutCurrentUser = function (){
                UserService.logoutUser(user)
                    .then(function success(res) {
                        console.log('UI: Logout successful');
                        Flash.create('success',res.data);
                        $location.path('/');
                    }, function failure(res){
                        console.log('UI: Logout failed');
                        Flash.create('danger',res.data);
                    });

            };
        }
});
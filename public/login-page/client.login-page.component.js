angular.module('phytotronAccountingApp').
    component('loginPage',{
        templateUrl: 'login-page/client.login-page.template.html',
        controller: function LoginFormController(UserService, Flash, $location, user) {
            var ctrl = this;

            ctrl.user = {
                username:"",
                password:""
            };

            ctrl.userLogin = function(){
                UserService.loginUser(ctrl.user)
                    .then(function success(res){
                        user.username = ctrl.user.username;
                        Flash.create('success',res.data);
                        $location.path( '/home' );
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });


            };
        }
    });
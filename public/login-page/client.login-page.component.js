angular.module('phytotronAccountingApp').
    component('loginPage',{
        templateUrl: 'login-page/client.login-page.template.html',
        controller: function LoginFormController(UserService, Flash, $location) {
            var ctrl = this;

            ctrl.user = {
                username:"",
                password:""
            };

            ctrl.$onInit = function () {
                UserService.getLoginStatus()
                    .then(function success(res){
                        if(res.data.isLoggedIn === true){
                            $location.path('/home');
                        }
                    }, function failure(res) {
                        Flash.create('danger',res.data);
                    });
            };

            ctrl.userLogin = function(){
                UserService.loginUser(ctrl.user)
                    .then(function success(res){
                        Flash.create('success',res.data);
                        $location.path( '/home' );
                    }, function failure(res){
                        Flash.create('danger',res.data);
                    });
            };
        }
    });
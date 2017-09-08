angular.module('phytotronAccountingApp').
    component('loginPage',{
        templateUrl: 'login-page/client.login-page.template.html',
        controller: function LoginFormController($location) {
            this.user = {
                username:"",
                password:""
            };

            this.authenticateUser = function(){
                console.log("Authenticating user: "+this.user.username);
                $location.path( '/home-page' );
            };
        }
    });
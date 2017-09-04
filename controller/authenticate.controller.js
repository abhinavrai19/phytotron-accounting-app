var passport = require('passport');

exports.authenticateUser =  function (){
    passport.authenticate('local-signIn', function(req, res){
        res.json({
            loginStatus: true
        });
    });
}

exports.logoutUser = function(req, res){
    req.logout();
    res.json({
        loginStatus: false
    });
}
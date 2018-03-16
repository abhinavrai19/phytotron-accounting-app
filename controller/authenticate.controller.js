// This service is called only after pass.authenticate succeeds. A dummy service to return log in successful message
exports.logInUser = function(req,res){
    res.status(200);
    res.send('Login Successful');

};

// Logout current User.
exports.logoutUser = function(req, res){
    req.logout();
    req.session.destroy();
    res.status(200);
    res.send('User Logged Out SuccessFully');
};

// Service to check if login is true, yes: proceed, no: return unauthorized
exports.isLoggedIn = function (req,res,next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.status(401);
    res.send('Invalid LogIn: Please Log In again.');
};

// Service to get the status of isUserLoggedIn
exports.getLoginStatus = function(req,res){
    var loginStatus = {
        isLoggedIn : false
    };
    if (req.isAuthenticated()){
        loginStatus.isLoggedIn = true;
    }
    res.send(loginStatus);
};
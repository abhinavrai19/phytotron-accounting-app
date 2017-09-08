

exports.logoutUser = function(req, res){
    req.logout();
    res.json({
        loginStatus: false
    });
}
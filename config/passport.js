var LocalStrategy = require('passport-local').Strategy;
var User =  require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, done);
    });

    passport.use( 'local-signIn', new LocalStrategy(
        function(username, password, done){
            User.findOne({username: username}, function(err, user){
                if(err){
                    return done(err);
                }
                if(!user){
                    return done(null, false, {message: 'Incorrect Username'});
                }
                if(!user.validPassword(password)){
                    return done(null, false, { message: 'Incorrect password.' });
                }
            })
        }));
};
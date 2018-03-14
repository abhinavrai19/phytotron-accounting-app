// Configure passport module for authentication
var LocalStrategy = require('passport-local').Strategy;
var User =  require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err,user){
            done(err,user);
        });
    });

    passport.use( 'local', new LocalStrategy(
        function(username, password, done){
            User.findOne({username: username}, function(err, user){
                // User Query errors out.
                if(err){
                    console.log('LOG: passport.js, LocalStrategy error');
                    return done(err);
                }
                // If user is not found in the DB
                if(!user){
                    console.log('LOG: passport.js, LocalStrategy user not found');
                    return done(null, false, {message: 'Incorrect Username/Password'});
                }
                // If User is found, but the password is incorrect
                if(!user.validPassword(password)){
                    console.log('LOG: passport.js, LocalStrategy incorrect password');
                    return done(null, false, { message: 'Incorrect Username/Password'});
                }
                // If credentials are correct return the user
                console.log('LOG: passport.js, LOGIN SUCCESSFUL');
                return done(null, user);
            })
        }));
};
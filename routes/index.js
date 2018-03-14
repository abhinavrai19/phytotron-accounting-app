var express = require('express');
var router = express.Router();
var passport = require('passport');

// Including respective controllers to route to map requests to functions.
var AuthenticateController = require('../controller/authenticate.controller');



// Open AngularJS index.html //
router.get('/', function(req, res) {
  res.render('index');
});

// Login/Logout Routes //
router.post('/login',passport.authenticate('local'), AuthenticateController.logInUser);

router.post('/logout', AuthenticateController.logoutUser);

module.exports = router;
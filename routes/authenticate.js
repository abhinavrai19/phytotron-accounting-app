var express = require('express');
var router = express.Router();
var passport = require('passport');

var authenticateController = require('../controller/authenticate.controller');

router.post('/login',passport.authenticate('local-signIn',{successFlash: true, failureFlash: true}));

router.get('/logout', authenticateController.logoutUser);

module.exports = router;
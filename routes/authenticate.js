var express = require('express');
var router = express.Router();
var authenticateController = require('../controller/authenticate.controller');

router.post('/login', authenticateController.authenticateUser);

router.get('/logout', authenticateController.logoutUser);

module.exports = router;
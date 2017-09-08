var express = require('express');
var router = express.Router();

// Including respective controllers to route to map requests to functions.
var ChamberController = require('../controller/chamber.controller');

// Open AngularJS index.html //
router.get('/', function(req, res, next) {
  res.render('index');
});

// Chamber Routes //

// Get All chambers List
router.get('/chambers', ChamberController.getChamberList);

// Get A Single Chamber by Name
router.get('/chamber/:id', ChamberController.getChambeByName);



module.exports = router;

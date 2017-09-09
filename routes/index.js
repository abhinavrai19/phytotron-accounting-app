var express = require('express');
var router = express.Router();

// Including respective controllers to route to map requests to functions.
var ChamberController = require('../controller/chamber.controller');
var RateController = require('../controller/rate.controller');

// Open AngularJS index.html //
router.get('/', function(req, res, next) {
  res.render('index');
});

// Chamber Routes //

// Get chamber List
router.get('/chambers', ChamberController.getChamberList);

// Get A Single Chamber by Name
router.get('/chamber/:id', ChamberController.getChamberByName);

// Create a Chamber
router.post('/chamber/create', ChamberController.createChamber);

// Update a Chamber
router.post('/chamber/update', ChamberController.updateChamber);

// Rate Routes //

//Get Rate List
router.get('/rates', RateController.getRateList);

// Get a Single Rate by Name
router.get('/rate/:id', RateController.getRateByType);

// Create a Rate
router.post('/rate/create', RateController.createRate);

// Update a Rate
router.post('/rate/update', RateController.updateRate);




module.exports = router;

var express = require('express');
var router = express.Router();

// Including respective controllers to route to map requests to functions.
var ClientController = require('../controller/client.controller');

var ChamberController = require('../controller/chamber.controller');
var RateController = require('../controller/rate.controller');
var DepartmentController = require('../controller/department.controller');
var CropController = require('../controller/crop.controller');
var ResourceController = require('../controller/resource.controller');

// Open AngularJS index.html //
router.get('/', function(req, res) {
  res.render('index');
});

// Client Routes //-------------------------------------------------

// Get Client List
router.get('/clients', ClientController.getClientList);

// Get Client by Id
router.get('/client/:id', ClientController.getClientById);

// Create Client
router.post('/client/create', ClientController.createClient);

// Update Client
router.post('/client/update', ClientController.updateClient);

// Chamber Routes //-------------------------------------------------

// Get chamber List
router.get('/chambers', ChamberController.getChamberList);

// Get A Single Chamber by Name
router.get('/chamber/:id', ChamberController.getChamberByName);

// Create a Chamber
router.post('/chamber/create', ChamberController.createChamber);

// Update a Chamber
router.post('/chamber/update', ChamberController.updateChamber);

// Rate Routes //-------------------------------------------------

// Get Rate List
router.get('/rates', RateController.getRateList);

// Get a Single Rate by Name
router.get('/rate/:id', RateController.getRateByType);

// Create a Rate
router.post('/rate/create', RateController.createRate);

// Update a Rate
router.post('/rate/update', RateController.updateRate);

// Department Routes //-------------------------------------------------

// Get Department List
router.get('/departments', DepartmentController.getDepartmentList);

// Get Department by Id
router.get('/department/:id', DepartmentController.getDepartmentById);

// Create Department
router.post('/department/create', DepartmentController.createDepartment);

// Update Department
router.post('/department/update', DepartmentController.updateDepartment);

// Crop Routes //-------------------------------------------------

// Get Crop List
router.get('/crops', CropController.getCropList);

// Get Crop by name
router.get('/crop/:id', CropController.getCropByName);

// Create Crop
router.post('/crop/create', CropController.createCrop);

// Update Crop
router.post('/crop/update', CropController.updateCrop);

// Resource Routes //-------------------------------------------------

// Get Resource List
router.get('/resources', ResourceController.getResourceList);

// Get Resource by name
router.get('/resource/:id', ResourceController.getResourceByName);

// Create Resource
router.post('/resource/create', ResourceController.createResource);

// Update Resource
router.post('/resource/update', ResourceController.updateResource);



module.exports = router;

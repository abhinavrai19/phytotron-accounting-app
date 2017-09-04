var express = require('express');
var router = express.Router();

/* Open AngularJS index.html */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

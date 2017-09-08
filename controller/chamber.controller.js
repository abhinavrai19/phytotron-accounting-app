var Chamber = require('../models/chamber');

var async = require('async');

// Get Chamber List
exports.getChamberList = function(req, res){
    Chamber.find({})
        .sort({chamber_name: 'ascending'})
        .exec(function(err, chamberList){
           if(err){
               res.send(err);
           }
           res.send(chamberList);
        });
};

// Get Chamber By Name
exports.getChambeByName = function(req, res){
    Chamber.find({chamber_name: req.params.id})
        .exec(function(err, chamber){
            if(err){
                res.send(err);
            }
            res.send(chamber);
        });
};

// Create Chamber
exports.createChamber = function(req, res){
    //req.check('chamber_name').notEmpty().withMessage('Chamber Name cannot be empty');
    console.log(req.body);
    /*

    var ChamberInstance = new Chamber({
        chamber_name: req.body.chamber_name,
        carts_count: req.body.carts_count
    });
*/

};
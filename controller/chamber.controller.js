var Chamber = require('../models/chamber');

var async = require('async');

// Get Chamber List
exports.getChamberList = function(req, res){
    Chamber.find()
        .exec(function(err, chamberList){
           if(err){
               res.status(500);
               res.send('Error fetching chamber List'+err);
           } else{
               res.send(chamberList);
           }

        });
};

// Get Chamber By Name
exports.getChamberByName = function(req, res){
    Chamber.findOne({chamber_name: req.params.id})
        .exec(function(err, chamber){
            if(err){
                res.status(500);
                res.send('Cannot find the requested chamber: '+err);
            } else{
                res.send(chamber);
            }

        });
};

// Create Chamber
exports.createChamber = function(req, res){

    var chamberInstance = new Chamber({
        chamber_name: req.body.chamber_name,
        carts_count: req.body.carts_count
    });

    chamberInstance.save(function(err){
        if(err){
            res.status(500);
            res.send('Error creating chamber: either duplicate name or missing fields: '+err);
        }else{
            res.send('Chamber Successfully Created');
        }

    });
};

exports.updateChamber = function(req,res){
    Chamber.findOne({chamber_name: req.body.chamber_name}, function(err,chamber){
        if(err){
            res.status(500);
            res.send('Cannot find chamber to update');
        } else{
            chamber.set(req.body);
            chamber.save( function (err){
                if(err){
                    res.status(500);
                    res.send('Error Updating chamber: '+err);
                }else{
                    res.send('Chamber updated successfully');
                }
            });
        }

    });

}
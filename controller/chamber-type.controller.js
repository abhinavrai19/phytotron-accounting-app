var ChamberType = require('../models/chamber-type');


// Get Chamber Type List
exports.getChamberTypeList = function(req, res){
    ChamberType.find()
        .exec(function(err, chamberTypeList){
            if(err){
                res.status(500);
                res.send('Error fetching chamber Type List'+err);
            } else{
                res.send(chamberTypeList);
            }

        });
};

// Get Chamber Type By Name
exports.getChamberTypeByName = function(req, res){
    ChamberType.findOne({chamber_type_name: req.params.id})
        .exec(function(err, chamberType){
            if(err){
                res.status(500);
                res.send('Cannot find the requested chamber type: '+err);
            } else{
                res.send(chamberType);
            }
        });
};

// Create Chamber Type
exports.createChamberType = function(req, res){

    var chamberTypeInstance = new ChamberType({
        chamber_type_name: req.body.chamber_type_name,
        chamber_type_description: req.body.chamber_type_description
    });

    chamberTypeInstance.save(function(err){
        if(err){
            res.status(500);
            res.send('Error creating chamber type: either duplicate name or missing fields: '+err);
        }else{
            res.send('Chamber Type Successfully Created');
        }

    });
};

// Update Chamber Type Details
exports.updateChamberType = function(req,res){

    ChamberType.findOne({_id: req.body._id}, function(err,chamberType){
        if(err){
            res.status(500);
            res.send('Cannot find chamber type to update');
        } else{
            chamberType.set(req.body);
            chamberType.save( function (err){
                if(err){
                    res.status(500);
                    res.send('Error Updating Chamber Type: '+err);
                }else{
                    res.send('Chamber Type updated successfully');
                }
            });
        }

    });
}
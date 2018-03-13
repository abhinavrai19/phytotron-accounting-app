var Crop = require('../models/crop');

// Get Crop list
exports.getCropList = function(req, res){
    Crop.find()
        .exec(function(err, cropList){
            if(err){
                res.status(500);
                res.send('Unable to fetch crop List: '+err);
            } else{
                res.send(cropList);
            }
        });
};

// Get Crop by Scientific Name
exports.getCropByName = function(req, res){
    Crop.findOne({scientific_name: req.params.id})
        .exec(function(err, crop){
            if(err){
                res.status(500);
                res.send('Cannot find the requested Crop: '+err);
            }else{
                res.send(crop);
            }
        });
};

// Create Crop
exports.createCrop = function(req, res){
    var cropInstance = new Crop({
        scientific_name: req.body.scientific_name,
        common_name: req.body.common_name
    });

    cropInstance.save(function(err){
        if(err){
            res.status(500);
            res.send('Error creating Crop: either duplicate type or missing values: '+ err);
        }else{
            res.send('Crop Successfully Created');

        }
    });

};

// Update Crop
exports.updateCrop = function(req,res){
    Crop.findOne({_id: req.body._id}, function(err, crop){
        if(err){
            res.status(500);
            res.send('Cannot find crop to update');
        }else{
            crop.set(req.body);
            crop.save(function(err){
                if(err){
                    res.status(500);
                    res.send('Error updating crop :'+err);
                }else{
                    res.send('Crop successfully updated');
                }
            });
        }
    });
};
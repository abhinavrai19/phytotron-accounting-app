var Resource = require('../models/resource');

// Get Resource List
exports.getResourceList = function(req, res){
    Resource.find()
        .exec(function(err, resourceList){
            if(err){
                res.status(500);
                res.send('Unable to fetch Resource List: '+ err);
            }else{
                res.send(resourceList);
            }
        });
};

// Find Resource by Name
exports.getResourceByName = function(req, res){
    Resource.findOne({resource_name: req.params.id})
        .exec(function(err, resource){
            if(err){
                res.status(500);
                res.send('Cannot find the requested Resource: '+ err);
            }else{
                res.send(resource);
            }

        });
};

// Create new Resource
exports.createResource = function(req, res){
    var resourceInstance = new Resource({
        resource_name: req.body.resource_name,
        unit_of_measure: req.body.unit_of_measure
    });

    resourceInstance.save(function(err){
        if(err){
            res.status(500);
            res.send('Error creating resource: either duplicate id or missing field: '+err);
        } else{
            res.send('Resource Created Successfully');
        }

    });
};

// update Resource
exports.updateResource = function(req, res){
    Resource.findOne({_id: req.body._id},function(err, resource){
        if(err){
            res.status(500);
            res.send('Cannot find the resource to update: '+err);
        } else{
            resource.set(req.body);
            resource.save(function(err){
                if(err){
                    res.status(500);
                    res.send('Error updating resource: '+err);
                }else{
                    res.send('Resource successfully updated');
                }
            });
        }
    });
};


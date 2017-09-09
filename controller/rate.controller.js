var Rate = require('../models/rate');

// Get Rate list
exports.getRateList = function(req, res){
    Rate.find()
        .exec(function(err, rateList){
           if(err){
               res.status(500);
               res.send('Unable to fetch rate List: '+err);
           } else{
               res.send(rateList);
           }
        });
};

// Get Rate by Type
exports.getRateByType = function(req, res){
    Rate.findOne({rate_type: req.params.id})
        .exec(function(err, rate){
           if(err){
               res.status(500);
               res.send('Cannot find the requested Rate: '+err);
           }else{
               res.send(rate);
           }
        });
};

// Create Rate
exports.createRate = function(req, res){
    var rateInstance = new Rate({
        rate_type: req.body.rate_type,
        rate_value: req.body.rate_value
    });

    rateInstance.save(function(err){
        if(err){
            res.status(500);
            res.send('Error creating Rate: either duplicate type or missing values: '+ err);
        }else{
            res.send('Rate Successfully Created');

        }
    });

};

// Update Rate
exports.updateRate = function(req,res){
    Rate.findOne({rate_type: req.body.rate_type}, function(err, rate){
        if(err){
            res.status(500);
            res.send('Cannot find rate to update');
        }else{
            rate.set(req.body);
            rate.save(function(err){
                if(err){
                    res.status(500);
                    res.send('Error updating rate :'+err);
                }else{
                    res.send('Rate successfully updated');
                }
            });
        }
    });
};
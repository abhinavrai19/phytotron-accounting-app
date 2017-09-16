var Project = require('../models/project');
var Chamber = require('../models/chamber');


var async = require('async');

exports.getChamberUsageReportByDate = function (req, res) {
    var usageStartDate = req.body.usageStartDate;
    var usageEndDate = req.body.usageEndDate;

    Project.find()
        .populate('chambers.chamber')
        .select('chambers project_id')
        .where('chambers.chamber_allocation_date').lte(usageEndDate)
        .where('chambers.chamber_deallocation_date').gte(usageStartDate)
        .exec(function(err, report){
            if(err){
                res.status('500');
                res.send('Error generating Chamber Usage Report'+err);
            }else{
                res.send(report);
            }
        });
};
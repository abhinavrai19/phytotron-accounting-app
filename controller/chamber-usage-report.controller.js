var Project = require('../models/project');
var moment = require('moment');

exports.getChamberUsageReportByDate = function (req, res) {
    var usageStartDate = req.body.usageStartDate;
    var usageEndDate = req.body.usageEndDate;

    Project.find()
        .populate('chambers.chamber')
        .populate('clients')
        .populate('chambers.crop')
        .where('project_start_date').lte(usageEndDate)
        .where('project_end_date').gte(usageStartDate)
        .exec(function(err, report){
            if(err){
                res.status('500');
                res.send('Error generating Chamber Usage Report'+err);
            }else{
                // FORMAT DATA AS PER USAGE REPORT

                var usageReport = [];
                report.forEach(function(projectEntry){

                    // client details
                    var primaryClient = projectEntry.clients[0];
                    var primaryClientName = primaryClient.first_name +' '+ primaryClient.last_name;
                    var primaryClientDepartment = primaryClient.department;

                    // project details
                    var projectId = projectEntry.project_id;
                    var projectTitle = projectEntry.project_title;

                    // for each chamber entry, using these values fill the response array
                    projectEntry.chambers.forEach(function(chamberEntry){
                        var usageEntry = {};
                        usageEntry.chamber_name = chamberEntry.chamber.chamber_name;
                        usageEntry.chamber_type = chamberEntry.chamber.chamber_type;
                        usageEntry.chamber_allocation_date = moment(chamberEntry.chamber_allocation_date).format('L');
                        usageEntry.chamber_deallocation_date = moment(chamberEntry.chamber_deallocation_date).format('L');
                        usageEntry.carts_allocated = chamberEntry.carts_allocated;
                        usageEntry.crop = chamberEntry.crop.scientific_name;
                        usageEntry.department = primaryClientDepartment;
                        usageEntry.client_name = primaryClientName;
                        usageEntry.project_id = projectId;
                        usageEntry.project_title = projectTitle;

                        // push into response array
                        usageReport.push(usageEntry);
                    });

                });
                res.send(usageReport);
            }
        });
};
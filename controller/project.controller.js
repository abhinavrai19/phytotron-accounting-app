var Project = require('../models/project');

// Get Project list
exports.getProjectList = function(req, res){
    Project.find()
        .exec(function(err, projectList){
            if(err){
                res.status(500);
                res.send('Unable to fetch Project List: '+err);
            } else{
                res.send(projectList);
            }
        });
};

// Get Project by Project Id
exports.getProjectById = function(req, res){
    Project.findOne({project_id: req.params.id})
        .exec(function(err, project){
            if(err){
                res.status(500);
                res.send('Cannot find the requested Project: '+err);
            }else{
                res.send(project);
            }
        });
};

// Create Project
exports.createProject = function(req, res){
    var projectInstance = new Project({
        project_id:                     req.body.project_id,
        project_title:                  req.body.project_title,
        project_start_date:             req.body.project_start_date,
        project_end_date:               req.body.project_end_date,
        clients:                        req.body.clients,
        chamber_rate:                   req.body.chamber_rate,
        chambers:                       req.body.chambers,
        requires_additional_resources:  req.body.requires_additional_resources,
        additional_resources:           req.body.additional_resources,
        project_status:                 req.body.project_status,
        invoices:                       req.body.invoices,
        last_invoice_date:              req.body.last_invoice_date,
        payments:                       req.body.payments
    });

    projectInstance.save(function(err){
        if(err){
            res.status(500);
            res.send('Error creating Project: either duplicate type or missing values: '+ err);
        }else{
            res.send('Project Successfully Created');

        }
    });

};

// Update Project
exports.updateProject = function(req,res){
    Project.findOne({project_id: req.body.project_id}, function(err, project){
        if(err){
            res.status(500);
            res.send('Cannot find Project to update');
        }else{
            project.set(req.body);
            project.save(function(err){
                if(err){
                    res.status(500);
                    res.send('Error updating Project :'+err);
                }else{
                    res.send('Project successfully updated');
                }
            });
        }
    });
};
var Project = require('../models/project');

// Get Project list
exports.getProjectList = function(req, res){
    Project.find()
        .populate('clients')
        .populate('chambers.chamber')
        .populate('chambers.crop')
        .populate('additional_resources.resource')
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
        .populate('clients')
        .populate('chambers.chamber')
        .populate('chambers.crop')
        .populate('additional_resources.resource')
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
    // Parse response for ids before saving project
    var project = parseClientIdsInProject(req.body);
    project = parseChamberIdsInProject(project);
    project = parseResourceIdsInProject(project);

    var projectInstance = new Project({
        project_id:                     project.project_id,
        project_title:                  project.project_title,
        project_start_date:             project.project_start_date,
        project_end_date:               project.project_end_date,
        clients:                        project.clients,
        chamber_rate:                   project.chamber_rate,
        chambers:                       project.chambers,
        requires_additional_resources:  project.requires_additional_resources,
        additional_resources:           project.additional_resources,
        project_status:                 project.project_status,
        invoices:                       project.invoices,
        last_invoice_date:              project.last_invoice_date,
        payments:                       project.payments
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
            var updatedProject = parseClientIdsInProject(req.body);
            updatedProject = parseChamberIdsInProject(updatedProject);
            updatedProject = parseResourceIdsInProject(updatedProject);
            project.set(updatedProject);
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

// Get Client _ids and replace with respective client objects in request.

var parseClientIdsInProject = function(project){
    project.clients.forEach(function(client){
        client = client._id;
    });
    return project;
};

var parseChamberIdsInProject = function(project){
    project.chambers.forEach(function(chamberEntry){
        chamberEntry.chamber = chamberEntry.chamber._id;
        chamberEntry.crop = chamberEntry.crop._id;
    });
    return project;
};

var parseResourceIdsInProject = function(project){
    project.additional_resources.forEach(function(resourceEntry){
        resourceEntry.resource = resourceEntry.resource._id;
    });
    return project;
};
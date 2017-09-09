var Department = require('../models/department');

// Get Department List
exports.getDepartmentList = function(req, res){
    Department.find()
        .exec(function(err, departmentList){
            if(err){
                res.status(500);
                res.send('Unable to fetch Department List: '+ err);
            }else{
                res.send(departmentList);
            }
        });
};

// Find Department by id
exports.getDepartmentById = function(req, res){
    Department.findOne({department_id: req.params.id})
        .exec(function(err, department){
            if(err){
                res.status(500);
                res.send('Cannot find the requested Department: '+ err);
            }else{
                res.send(department);
            }

        });
};

// Create new Department
exports.createDepartment = function(req, res){
    var departmentInstance = new Department({
        department_id: req.body.department_id,
        department_name: req.body.department_name
    });

    departmentInstance.save(function(err){
       if(err){
            res.status(500);
            res.send('Error creating department: either duplicate id or missing field: '+err);
       } else{
           res.send('Department Created Successfully');
       }

    });
};

// update Department
exports.updateDepartment = function(req, res){
    Department.findOne({department_id: req.body.department_id},function(err, department){
       if(err){
           res.status(500);
           res.send('Cannot find the department to update: '+err);
       } else{
           department.set(req.body);
           department.save(function(err){
               if(err){
                   res.status(500);
                   res.send('Error updating department: '+err);
               }else{
                   res.send('Department successfully updated');
               }
           });
       }
    });
};


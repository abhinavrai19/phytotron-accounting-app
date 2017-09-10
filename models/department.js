// Model definition for Department
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    department_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    department_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Department', DepartmentSchema);
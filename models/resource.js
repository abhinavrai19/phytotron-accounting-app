// Model definition for Resource
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResourceSchema = new Schema({
    resource_name: {
        type: String,
        required: true,
        unique: true
    },
    unit_of_measure: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);
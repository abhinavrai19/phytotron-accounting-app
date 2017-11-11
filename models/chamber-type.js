// Model definition for Chamber Type
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChamberTypeSchema = new Schema({
    chamber_type_name: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    chamber_type_description: String
});

module.exports = mongoose.model('ChamberType', ChamberTypeSchema);
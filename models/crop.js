// Model definition for Crops
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CropSchema = new Schema({
    scientific_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    common_name:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Crop', CropSchema);
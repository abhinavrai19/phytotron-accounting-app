// Model definition for Chambers
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChamberSchema = new Schema({
    chamber_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    carts_count: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('Chamber', ChamberSchema);
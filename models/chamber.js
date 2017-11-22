// Model definition for Chambers
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ChamberType = require('./chamber-type');

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
    },
    chamber_type: {
        type: Schema.Types.ObjectId,
        ref: 'ChamberType',
        required: true

    },
    chamber_description: String
});

module.exports = mongoose.model('Chamber', ChamberSchema);
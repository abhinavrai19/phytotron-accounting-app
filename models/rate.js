// Model definition for Rate
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RateSchema = new Schema({
    rate_type: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    rate_value: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('Rate', RateSchema);
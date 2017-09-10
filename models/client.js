// Model definition for Client
var mongoose = require('mongoose');

// References to other schemas
var Department = require('./department');

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: String,
    email: String,
    contact_number: String,
    address: String,
    account_numbers: [String],
    department: String,
    status: {
        type: String,
        enum: ['ACTIVE','INACTIVE']
    }
});

module.exports = mongoose.model('Client', ClientSchema);
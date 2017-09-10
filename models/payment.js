'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Project = require('./project');

var PaymentSchema = new Schema({
    payment_id: {
        type: String,
        unique: true,
        required: true
    },
    project_id:{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    payee_account: String,
    payment_date: {
        type: Date,
        default: Date.now
    },
    payment_amount: {
        type: Number,
        min: 0
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
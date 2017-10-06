'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Project = require('./project');

var InvoiceSchema = new Schema({
    invoice_id: {
        type: String,
        required: true,
        unique: true,
    },
    project_id: String,
    generation_date: {
        type: Date,
        required: true
    },
    bill_start_date: Date,
    bill_end_date: Date,
    bill_amount: {
        type: Number,
        min: 0
    },
    chamber_usage_cost: [
        {
            chamber_name: String,
            start_date: Date,
            end_date: Date,
            chamber_rate: Number,
            chamber_cost: Number
        }
    ],
    additional_resource_cost: [
        {
            resource_name: String,
            unit_rate: Number,
            units_consumed: Number,
            start_date: Date,
            end_date: Date,
            description: String,
            comments: String,
            resource_cost: Number

        }
    ],
    adjustments: {
        type: Number,
        default: 0
    },
    discounts: {
        Type: Number,
        default: 0
    },
    total_amount: Number
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
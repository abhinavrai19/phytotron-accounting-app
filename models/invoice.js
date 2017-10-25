'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Project = require('./project');

var InvoiceSchema = new Schema({
    phytotron_id: String,
    invoice_id: {
        type: String,
        required: true,
        unique: true,
    },
    project_id: String,
    project_title: String,
    project_start_date: String,
    project_end_date: String,
    clients: [
        {
            first_name: String,
            last_name: String,
            department: String,
            address: String
        }
    ],
    generation_date: Date,
    bill_start_date: Date,
    bill_end_date: Date,
    bill_amount: {
        type: Number,
        min: 0
    },
    chamber_usage_cost: [
        {
            chamber_name: String,
            carts_allocated: Number,
            start_date: String,
            end_date: String,
            usage_days: Number,
            chamber_rate: Number,
            chamber_cost: Number
        }
    ],
    additional_resource_cost: [
        {
            resource_name: String,
            unit_rate: Number,
            units_consumed: Number,
            start_date: String,
            end_date: String,
            usage_days: Number,
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
        type: Number,
        default: 0
    },
    total_amount: Number
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
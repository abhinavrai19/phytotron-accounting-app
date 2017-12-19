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
    adjustments_comments: String,
    discounts: {
        type: Number,
        default: 0
    },
    discounts_comments: String,
    total_amount: Number,
    invoice_amount_distribution: [
        {
            client_first_name: String,
            client_last_name: String,
            account_number: String,
            percent_share: String,
            share_amount: Number
        }
    ],
    is_invoice_paid:{
        type: Boolean,
        default: false
    },
    payment_date: Date
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
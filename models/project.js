'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Chamber = require('./chamber');
var Resource = require('./resource');
var Rate = require('./rate');
var Client = require('./client');
var Invoice = require('./invoice');
var Payment = require('./payment');

var ProjectSchema = new Schema({

    project_id: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    },

    project_title: String,

    project_start_date: {
        type: Date,
        default: Date.now,
        required: true
    },

    project_end_date: Date,

    clients:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Client'
        }
    ],

    chamber_rate: {
        type: Schema.Types.ObjectId,
        ref: 'Rate'
    },

    chambers: [
        {
            chamber:{
                type: Schema.Types.ObjectId,
                ref: 'Chamber'

            },
            carts_allocated: {
                type: Number,
                min: 0,
                default: 0
            },
            chamber_allocation_date: {
                type: Date,
                default: Date.now
            },
            chamber_deallocation_date: {
                type: Date,
                default: Date.now
            },

        }
    ],

    requires_additional_resources: Boolean,

    additional_resources: [
        {
            resource:{
                type: Schema.Types.ObjectId,
                ref: 'Resource'

            },
            unit_rate: {
                type: Number,
                min: 0,
                default: 0
            },
            units_consumed: {
                type: Number,
                min: 0,
                default: 0
            },
            resource_allocation_date: {
                type: Date,
                default: Date.now
            },
            resource_deallocation_date: {
                type: Date,
                default: Date.now
            },
            resource_description: String,
            resource_comments: String
        }
    ],

    project_status:{
        type: String,
        enum: ['ACTIVE','PAYMENT PENDING','COMPLETED'],
        default: 'ACTIVE'
    },

    invoices:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Invoice'
        }
    ],

    last_invoice_date: Date,

    payments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        }
    ]

});


module.exports = mongoose.model('Project', ProjectSchema);
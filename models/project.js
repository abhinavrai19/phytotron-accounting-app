'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Chamber = require('./chamber');
var Crop = require('./crop');
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
            crop:{
                type: Schema.Types.ObjectId,
                ref: 'Crop'
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
            resource_comments: String,
            resource_invoiced: {
                type: Boolean,
                default: false
            },
            associated_invoice_id: {
                type: String,
                default: ''
            }
        }
    ],

    project_status:{
        type: String,
        enum: ['ACTIVE','PAYMENT PENDING','COMPLETED'],
        default: 'ACTIVE'
    },

    // Invoicing and revert Invoice related data.

    last_invoice_date: Date,

    last_invoice_id: {
        type: String,
        default: ''
    },

    revert_to_invoice_date: Date,

    revert_to_invoice_id: {
        type: String,
        default: ''
    },

    revert_invoice_possible: {
        type: Boolean,
        default: false
    }

});


module.exports = mongoose.model('Project', ProjectSchema);
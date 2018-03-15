'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    created_by: String,
    created_on: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Note', NoteSchema);
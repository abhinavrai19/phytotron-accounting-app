// Model definition for Users
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema =  new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }

});

UserSchema.methods.validPassword = function(password){
    return this.password === password;
};

module.exports = mongoose.model('User', UserSchema);
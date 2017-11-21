// Set up database connection
var mongoose = require('mongoose');
var constants = require('../constants');

module.exports = function(){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://127.0.0.1/phytotron_accounts',{
        useMongoClient: true,
        user: constants.MONGO_DB_USER_NAME,
        pass: constants.MONGO_DB_USER_PASSWORD,
        auth: {
            authdb: constants.MONGO_DB_USER_ROLE
        }
    });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB Connection error'));

    return db;
}


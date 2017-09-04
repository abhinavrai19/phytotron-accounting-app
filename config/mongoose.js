var mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://127.0.0.1/phytotron_accounts',{
        useMongoClient: true
    });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB Connection error'));

    return db;

}


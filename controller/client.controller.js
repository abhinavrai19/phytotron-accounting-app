var Client = require('../models/client');

// Get a list of Clients
exports.getClientList = function (req, res) {
    Client.find()
        .exec(function(err, clientList){
            if(err){
                res.status(500);
                res.send('Unable to fetch client list: '+err);
            }else{
                res.send(clientList);
            }
        });
};

// Get Client by Id
exports.getClientById = function (req, res) {
    Client.findById(req.params.id)
        .exec(function (err, client) {
            if(err){
                res.status(500);
                res.send('Error fetching client: '+err);
            }else{
                res.send(client);
            }
        });
};

// Create Client
exports.createClient = function (req, res) {
    console.log('from server client controller create');
    console.log(req.data);
    var clientInstance = new Client({
        first_name:      req.body.first_name,
        last_name:       req.body.last_name,
        email:           req.body.email,
        contact_number:  req.body.contact_number,
        address:         req.body.address,
        account_numbers: req.body.account_numbers,
        department:      req.body.department,
        status:          req.body.status
    });

    clientInstance.save(function (err) {
        if(err){
            res.status(500);
            res.send('Error creating client: '+err);
        } else{
            res.send('Client Created Successfully');
        }
    });
};

// Update Client
exports.updateClient = function (req, res) {
    Client.findOne({_id: req.body._id})
        .exec(function (err,client) {
            if(err){
                res.status(500);
                res.send('Error finding client to update: '+err)
            }else{
                client.set(req.body);
                client.save(function (err) {
                    if(err){
                        res.status(500);
                        res.send('Error updating client: possibly incorrect update data: '+err);
                    }else{
                        res.send('Client updated successfully');
                    }
                });
            }
        });
};
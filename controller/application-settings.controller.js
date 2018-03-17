'use strict'
var constants = require('../constants');

// SETTER GETTER FOR INVOICE DIRECTORY SAVE PATH
var getInvoiceSaveDirectoryPath = function () {
    return constants.INVOICE_SAVE_DIRECTORY_PATH;
};

var setInvoiceSaveDirectoryPath = function (invoiceSaveDirectoryPath) {
    constants.INVOICE_SAVE_DIRECTORY_PATH = invoiceSaveDirectoryPath;
};


// EXPORTS for service
exports.getApplicationSettings = function (req, res) {
    var applicationSettings = {
        invoiceSaveDirectoryPath: getInvoiceSaveDirectoryPath()
    };

    res.send(applicationSettings);
};

exports.setApplicationSettings = function (req, res) {
    var applicationSettings = req.body;
    var isError = false;

    // -----------------------------------------
    // Invoice Save Directory Path
    var invoiceSaveDirectoryPathError = '';
    if(applicationSettings.invoiceSaveDirectoryPath === null || applicationSettings.invoiceSaveDirectoryPath === ''){
        invoiceSaveDirectoryPathError = 'ERROR: Directory Path cannot be null';
        isError = true;
    }else{
        setInvoiceSaveDirectoryPath(applicationSettings.invoiceSaveDirectoryPath);
    }


    // -----------------------------------------
    // Finally if any error occured in update, send response with error messages.
    if(isError){
        res.send('Application Settings Updated with Error: '+invoiceSaveDirectoryPathError+'; ');
    }else{
        res.send('Application Settings Updated Successfully');
    }
}
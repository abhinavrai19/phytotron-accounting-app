// print utilities
var moment = require('moment');
var CONSTANTS = require('../constants');
var wkhtmltopdf = require('wkhtmltopdf');
var hbs = require('hbs');
var fs = require('fs');

//PARSE INVOICE REPORT TEMPLATE ON SERVER START--------------------------------
var emptyReportTemplate = '<h1>MISSING INVOICE TEMPLATE</h1>';
var invoiceReportTemplate;

fs.readFile(CONSTANTS.INVOICE_REPORT_TEMPLATE_PATH,'utf8', function(err,data){
    if(err){
        console.log('Error Reading Invoice Report template file (invoice_report.hbs) '+err);
        invoiceReportTemplate = hbs.compile(emptyReportTemplate);
    }else{
        console.log('Invoice Report Template successfully compiled');
        invoiceReportTemplate = hbs.compile(data);
    }
});

// Utility function to generate a PDF for one report
var generateInvoicePDF = function (invoice) {
    // get moment objects from Date fields to format before passing to report
    var generationDate = moment(new Date(invoice.generation_date));
    var billStartDate = moment(new Date(invoice.bill_start_date));
    var billEndDate = moment(new Date(invoice.bill_end_date));

    // Prepare the data to be passed to the report
    var reportdata = {
        selectedInvoice:            invoice,
        generation_date:            generationDate.format('L'),
        bill_start_date:            billStartDate.format('L'),
        bill_end_date:              billEndDate.format('L')
    };

    // Generate HTML with the data from the current report
    var invoiceReportHTML = invoiceReportTemplate(reportdata);

    // set pdf file name
    var pdfFileName = invoice.invoice_id+'.pdf';
    var options = {
        output: pdfFileName,
        pageSize: 'A4',

    };

    // generate report pdf
    wkhtmltopdf(invoiceReportHTML,options);
};

// EXPORTS

// generate PDF for all invoices in the parameter array
exports.generateMultipleInvoicePDFs = function(invoices){
    invoices.forEach(function(invoice){
        generateInvoicePDF(invoice);
    });
};

// generate PDF for the invoice parameter
exports.generateSingleInvoicePDF = function (invoice) {
    generateInvoicePDF(invoice);
    
};


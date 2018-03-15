// Project related constants
module.exports = {

    // Key used by Authentication
    AUTHENTICATION_SECRET_KEY: 'HowDoYouTurnThisOn',

    // Path to connect to database
    MONGO_DB_PATH: 'mongodb://127.0.0.1/phytotron_accounting_database',

    MONGO_DB_USER_NAME: 'joe',

    MONGO_DB_USER_PASSWORD: 'phytomongo',

    MONGO_DB_USER_ROLE: 'admin',

    MONGO_DB_PORT: '27017',

    // Phytotron ID (used in invoices)
    PHYTOTRON_ID: 'A020201',

    // Invoice Template path
    INVOICE_REPORT_TEMPLATE_PATH: __dirname+'/views/'+'invoice_report.hbs',

    // Directory path to store the invoice reports in
    INVOICE_SAVE_DIRECTORY_PATH: '/Users/abhinavrai/Desktop/Phytotron/',

    //INVOICE_SAVE_DIRECTORY_PATH: 'C:\\PhytotronInvoiceReports\\',

    // Decimals to round off to while doing invoice amount calculations
    ROUND_OFF_AMOUNT_TO_VALUE: 2
};

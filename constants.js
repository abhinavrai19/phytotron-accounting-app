// Project related constants
module.exports = {

    // Key used by Authentication
    AUTHENTICATION_SECRET_KEY: 'HowDoYouTurnThisOn',

    // Path to connect to database
    MONGO_DB_IP: '127.0.0.1',

    MONGO_DB_PATH: 'mongodb://'+this.MONGO_DB_IP+'/phytotron_accounting_database',

    MONGO_DB_USER_NAME: 'phyto_admin',
    //MONGO_DB_USER_NAME: 'joe',

    MONGO_DB_USER_PASSWORD: 'phytotron1968',
    //MONGO_DB_USER_PASSWORD: 'phytomongo',

    MONGO_DB_USER_ROLE: 'admin',

    MONGO_DB_PORT: '27017',

    // Phytotron ID (used in invoices)
    PHYTOTRON_ID: 'A020201',

    // Invoice Template path
    INVOICE_REPORT_TEMPLATE_PATH: __dirname+'/views/'+'invoice_report.hbs',

    INVOICE_REPORT_TEMPLATE_NAME: 'invoice_report.hbs',

    // Directory path to store the invoice reports in
    INVOICE_SAVE_DIRECTORY_PATH: '/Users/abhinavrai/Desktop/datadrive/phyto_accounting/Phyto_Invoices/',

    //INVOICE_SAVE_DIRECTORY_PATH: '/datadrive/phyto_accounting/Phyto_Invoices/',

    // Decimals to round off to while doing invoice amount calculations
    ROUND_OFF_AMOUNT_TO_VALUE: 2,

    PRINT_PAGE_SIZE: 'Letter'
};

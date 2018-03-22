var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var cookieSession = require('cookie-session');

// get passport and pass it for configuration: Configuration is done in passport.js
var passport = require('passport');
require('./config/passport')(passport);

var AuthenticateController = require('./controller/authenticate.controller');

//routes
var index = require('./routes/index');
var protectedRoutes = require('./routes/protectedRoutes');
var Constants = require('./constants');

// ------------------------------------------------------------------------------------------------------------------
var app = express();

app.use(helmet());

//Set up mongoose connection
var mongoose = require('./config/mongoose');
mongoose();

// Set up invoice PDF template on server start up
var utilityGeneratePDF = require('./controller/utility.generatePDF');
utilityGeneratePDF.compileReportTemplate();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Hello Future Coder: This must be added after bodyParser
app.use(cookieParser());


// User authentication code
// Development environment use.
/*
app.use(require('express-session')({
    secret: Constants.AUTHENTICATION_SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

*/

// Production Environment use.
app.use(cookieSession({
    name: 'session',
    secret: Constants.AUTHENTICATION_SECRET_KEY,
    //keys: [/* secret keys */],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());


// Host public content
app.use(express.static(path.join(__dirname, 'public')));

// Call respective ROUTERS
app.use('/', index);
app.use('/', AuthenticateController.isLoggedIn, protectedRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

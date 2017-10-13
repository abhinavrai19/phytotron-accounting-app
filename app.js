var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var helmet = require('helmet');

// get passport and pass it for configuration: -Abhinav
//var passport = require('passport');
//require('./config/passport')(passport);

//routes
var index = require('./routes/index');
//var authenticate = require('./routes/authenticate')

var app = express();

app.use(helmet());

//Set up mongoose connection
var mongoose = require('./config/mongoose');
mongoose();


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

/*
// User authentication code
app.use(require('express-session')({
    secret: 'the lion king',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
*/

// Host public content
app.use(express.static(path.join(__dirname, 'public')));

// Call respective ROUTERS
app.use('/', index);
//app.use('/authenticate', authenticate);


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

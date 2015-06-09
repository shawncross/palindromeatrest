var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var AWS = require('aws-sdk');

/*
 * Time to do some non-default work. We are using Mongo DB and,
 * since this is a very simple app, Monk to interface with it.
 * So, lets grab both and then set up a variable to hold our
 * db.
 * 
 * Note, this may have to change to use Amazon's db. We'll see.
 */ 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/palindrome');

//Read config values from a JSON file.
// var config = fs.readFileSync('./app_config.json', 'utf8');
// config = JSON.parse(config);

//Create DynamoDB client and pass in region.
// var db = new AWS.DynamoDB({region: config.AWS_REGION});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Again, a bit of non-default work here. We need to make our 
 * db accessible to our router. Again, a simple app so lets just
 * add the db as a param to our requests.
 */ 
app.use(function(req,res,next){
    req.db = db;
    // req.dbTableName = config.STARTUP_SIGNUP_TABLE;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

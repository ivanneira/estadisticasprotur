var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');

//rutas de vistas
var index = require('./routes/index');
var estadisticas = require('./routes/estadisticas');
var seguimiento = require('./routes/seguimiento');

//rutas de datos
var getdata = require('./routes/getData');
var getcs = require('./routes/getCS');
var gettotales = require('./routes/getTotales');
var getseguimiento = require('./routes/getSeguimiento');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//bootstrap directory
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
//jquery directory
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
//highcharts directory
app.use(express.static(__dirname + '/node_modules/highcharts'));
//bootstrap-datepicker directory
app.use(express.static(__dirname + '/node_modules/bootstrap-datepicker/dist'));
//select2 directory
app.use(express.static(__dirname + '/node_modules/select2/dist'));
//async
app.use(express.static(__dirname + '/node_modules/async/dist'));

//rutas de vistas
app.use('/', index);
app.use('/estadisticas', estadisticas);
app.use('/seguimiento', seguimiento);

//rutas de datos
app.use('/getdata', getdata);
app.use('/getcs', getcs);
app.use('/gettotales', gettotales);
app.use('/getSeguimiento', getseguimiento);

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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var cors = require('cors');

//cors for browser can call the API

var timeValidateMiddleware = require('./middleware/timeValidate');
var transactionRouter = require('./router/transaction');
var usersRouter = require('./router/users/user');
var partnerRouter = require('./router/partner');
var debtRouter = require('./router/debt');
var debitRouter= require('./router/debit_account');
var savingRouter = require('./router/saving_account');
var otpRouter = require('./router/otp');
var corsMiddleware = require('./middleware/cors');
// var io = require('./realtime/io');

require('dotenv').config()

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(corsMiddleware);
app.use(timeValidateMiddleware);
app.use('/transaction', transactionRouter);
app.use('/users', usersRouter);
app.use('/partner', partnerRouter);
app.use('/debt', debtRouter);
app.use('/debit', debitRouter);
app.use('/saving', savingRouter);
app.use('/otp', otpRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err.message);
});


module.exports = app;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
//var personsRouter = require('./routes/persons'); //
const users = require('./routes/users.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false })); // doesn't work with formidable
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set("views", "./public");

app.use("/users", users.router);
app.use(users.checkLogin);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
//app.use('/persons', personsRouter);
//app.use('/users', usersRouter);

module.exports = app;

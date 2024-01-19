var express = require('express');


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
var cors = require('cors');
var expressLayouts = require('express-ejs-layouts'); 

//import {bindFlmngr} from "@flmngr/flmngr-server-node-express";
var flmngr = require("@flmngr/flmngr-server-node-express");



var superindexRouter = require('./routes/superindex');
var indexRouter = require('./routes/index');
//var apiRouter = require('./routes/api');
//var personsRouter = require('./routes/persons'); //
const api = require('./routes/api.js');
const users = require('./routes/users.js');
const file_management = require('./routes/file_management.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false })); // doesn't work with formidable
app.use(cookieParser());

// BODYPARSER AND FORMIDABLE DO NOT GET ON WELL
////app.use(bodyParser.urlencoded({ extended: true }));
////app.use(bodyParser.json());
////app.use(bodyParser.urlencoded({
////    extended: true
////})); 

//app.use()

app.use(cors());
app.use(expressLayouts);

app.engine('html', require('ejs').renderFile);
app.set("views", "./public");
app.set('view engine', 'ejs');

app.use('/', superindexRouter);
app.use("/users", users.router);
app.use(users.loginGuard);

app.use('/', indexRouter);
//app.use('/api', apiRouter);
app.use("/api", api.router);
app.use("/file-management", file_management);

//app.locals.users = users; //for access in EJS templates

//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/persons', personsRouter);
//app.use('/users', usersRouter);


/**
 * @note Tried to integrate with flmngr, but gave up
 */
flmngr.bindFlmngr({
    app: app,
    urlFileManager: "/flmngr",
    urlFiles: "/files/",
    dirFiles: "/pers/usrfiles"
});

//app.use("/manager", file_management.router);


module.exports = app;

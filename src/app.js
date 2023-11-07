var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

////var bodyParser = require('body-parser');
var cors = require('cors');
var expressLayouts = require('express-ejs-layouts'); 


var indexRouter = require('./routes/index');
//var apiRouter = require('./routes/api');
//var personsRouter = require('./routes/persons'); //
const api = require('./routes/api.js');
const users = require('./routes/users.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false })); // doesn't work with formidable
app.use(cookieParser());

////app.use(bodyParser.urlencoded({ extended: true }));
////app.use(bodyParser.json());
////app.use(bodyParser.urlencoded({
////    extended: true
////}));
app.use(cors());
app.use(expressLayouts);

app.engine('html', require('ejs').renderFile);
app.set("views", "./public");
app.set('view engine', 'ejs');

app.use("/users", users.router);
app.use(users.checkLogin);

app.use('/', indexRouter);
//app.use('/api', apiRouter);
app.use("/api", api.router);

//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/persons', personsRouter);
//app.use('/users', usersRouter);

module.exports = app;

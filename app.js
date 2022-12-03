require('dotenv').config();
const fileUpload = require('express-fileupload');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const apiV1Route = require('./routes');

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public2')));
app.use('/static', express.static(__dirname + '/public2'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public2', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(__dirname + '/public'));

app.use(
  session({
    secret: '123@abcd',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
);

const cors = require('cors');
app.use(cors({ origin: '*' }));

app.use(flash());

app.use('/api/v1', apiV1Route)

app.use(function (req, res, next) {
  next(createError(404));
});
app.listen(5555, function () {
  console.log('Node server running on port : 5555');
});

// error
app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;

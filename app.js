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
var userRoute = require('./routes/users');
var dbRoute = require('./routes/db');
const dbCableRouter = require('./routes/dbCable');
const dbTraceRouter = require('./routes/dbTrace');
const dbSpRouter = require('./routes/dbSp');
const dbSpFcsRouter = require('./routes/dbSpFcs');
const dbTpFcsRouter = require('./routes/dbTpFcs');
const dbTpPortsRouter = require('./routes/dbTpPorts');

const dbTpRouter = require('./routes/dbTp');
const dbLogRouter = require('./routes/dbLog');
const dbChangeStateRouter = require('./routes/changeState');
const dbAddSpItem = require('./routes/addSpItem');
const dbAddTpItem = require('./routes/addTpItem');
const dbAddCableItem = require('./routes/addCableItem');
const dbUpdateSpItem = require('./routes/updateSpItem');
const dbUpdateTpItem = require('./routes/updateTpItem');
const dbUpdateCableItem = require('./routes/updateCableItem');
const dbGetConnections = require('./routes/getConnections');
const dbAddConnections = require('./routes/addConnections');
const dbUpdateConnectionsFix = require('./routes/updateConnectionsFix');
const dbUpdateConnections = require('./routes/updateConnections');
const dbRemoveConnections = require('./routes/removeConnections');
const dbNewProject = require('./routes/dbNewProject');
const dbUpdateSplicesSp = require('./routes/updateSplicesSp');
const dbUpdateSplicesTp = require('./routes/updateSplicesTp');
const dbDeleteSpItem = require('./routes/deleteSpItem');
const dbDeleteTpItem = require('./routes/deleteTpItem');
const dbDeleteCableItem = require('./routes/deleteCableItem');
const dbUpdateSpLatLng = require('./routes/updateSpLatLng');
const dbUpdateTpLatLng = require('./routes/updateTpLatLng');
const dbUpdateCableLatLng = require('./routes/updateCableLatLng');
const dbFewSpRouter = require('./routes/getFewSp');
const dbGetProjectOptions = require('./routes/getProjectOptions');
const dbUpdateProjectOptions = require('./routes/setProjectOptions');
const UploadPicture = require('./routes/uploadPicture');
const downloadPicture = require('./routes/downloadPicture');
const deletePicture = require('./routes/deletePicture');
const getHistory = require('./routes/getHistory');
const updateSeqNumbers = require('./routes/updateSeqNumbers');

//const dbFewTpRouter = require('./routes/getFewTp');
//const dbFewCabRouter = require('./routes/getFewCab');

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
// app.use(express.static(path.resolve(__dirname, '../client/build')));

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

app.use('/users', userRoute);
app.use('/data-bases', dbRoute);
app.use('/db-cables', dbCableRouter);
app.use('/db-sp', dbSpRouter);
app.use('/db-getTrace', dbTraceRouter);
app.use('/getFewSp', dbFewSpRouter);
//app.use('/getFewTp', dbFewTpRouter);
//app.use('/getFewCab', dbFewCabRouter);
app.use('/db-sp-fcs', dbSpFcsRouter);
app.use('/db-tp', dbTpRouter);
app.use('/db-tp-fcs', dbTpFcsRouter);
app.use('/db-tp-ports', dbTpPortsRouter);
app.use('/log-file', dbLogRouter);
app.use('/change-state', dbChangeStateRouter);
app.use('/addSpItem', dbAddSpItem);
app.use('/addTpItem', dbAddTpItem);
app.use('/addCableItem', dbAddCableItem);
app.use('/updateSpItem', dbUpdateSpItem);
app.use('/updateTpItem', dbUpdateTpItem);
app.use('/updateCableItem', dbUpdateCableItem);
app.use('/getConnections', dbGetConnections);
app.use('/updateConnections', dbUpdateConnections);
app.use('/updateConnectionsFix', dbUpdateConnectionsFix);
app.use('/updateConnectionsAdd', dbAddConnections);
app.use('/updateConnectionsRemove', dbRemoveConnections);
app.use('/newProject', dbNewProject);
app.use('/updateSplicesSp', dbUpdateSplicesSp);
app.use('/updateSplicesTp', dbUpdateSplicesTp);
app.use('/deleteSpItem', dbDeleteSpItem);
app.use('/deleteTpItem', dbDeleteTpItem);
app.use('/deleteCableItem', dbDeleteCableItem);
app.use('/updateSpLatLng', dbUpdateSpLatLng);
app.use('/updateTpLatLng', dbUpdateTpLatLng);
app.use('/updateCableLatLng', dbUpdateCableLatLng);
app.use('/db-project-options', dbGetProjectOptions);
app.use('/updateProjectOptions', dbUpdateProjectOptions);
app.use('/uploadPicture', UploadPicture);
app.use('/getPicture', downloadPicture);
app.use('/deletePicture', deletePicture);
app.use('/getHistory/', getHistory);
app.use('/updateSeqNumbers/', updateSeqNumbers);

app.use(function (req, res, next) {
  next(createError(404));
});
app.listen(5000, function () {
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

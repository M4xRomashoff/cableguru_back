#!/usr/bin/.env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('back:server');
var http = require('http');
var https = require('https');

var CERTIFICATE_DIR = '/etc/letsencrypt/live/cableguru.ru';

var privateKey = fs.readFileSync(`${CERTIFICATE_DIR}/privkey.pem`, 'utf8');
var certificate = fs.readFileSync(`${CERTIFICATE_DIR}/cet.pem`, 'utf8');
var ca = fs.readFileSync(`${CERTIFICATE_DIR}/chain.pem`, 'utf8');

var credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT);
var portHttps = normalizePort(process.env.PORT_HTTPS);
app.set('port', port);
app.set('port', portHttps);

/**
 * Create HTTP HTTPS server.
 */

var server = http.createServer(app);
var serverHttps = https.createServer(app, credentials);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

serverHttps.listen(portHttps);
serverHttps.on('error', onError);
serverHttps.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log('qwe');
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

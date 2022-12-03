var express = require('express');
const dbUpdateConnections = new express.Router();
const dbUpdateConnectionsController = require('../controllers/dbUpdateConnectionsController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateConnections.post('/', ensureToken, dbUpdateConnectionsController.setData);

module.exports = dbUpdateConnections;

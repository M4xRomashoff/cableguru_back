var express = require('express');
const dbGetConnections = new express.Router();
const dbGetConnectionsController = require('../controllers/dbGetConnectionsController');
const { ensureToken } = require('../middleware/ensureToken');

dbGetConnections.get('/:dbName', ensureToken, dbGetConnectionsController.getAll);

module.exports = dbGetConnections;

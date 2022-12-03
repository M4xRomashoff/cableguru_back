var express = require('express');
const dbAddConnections = new express.Router();
const dbAddConnectionsController = require('../controllers/dbAddConnectionsController');
const { ensureToken } = require('../middleware/ensureToken');

dbAddConnections.post('/', ensureToken, dbAddConnectionsController.setData);

module.exports = dbAddConnections;

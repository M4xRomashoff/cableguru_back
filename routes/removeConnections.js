var express = require('express');
const dbRemoveConnections = new express.Router();
const dbRemoveConnectionsController = require('../controllers/dbRemoveConnectionsController');
const { ensureToken } = require('../middleware/ensureToken');

dbRemoveConnections.post('/', ensureToken, dbRemoveConnectionsController.setData);

module.exports = dbRemoveConnections;

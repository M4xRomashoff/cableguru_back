var express = require('express');
const dbUpdateConnectionsFix = new express.Router();
const dbUpdateConnectionsFixController = require('../controllers/dbUpdateConnectionsFixController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateConnectionsFix.post('/', ensureToken, dbUpdateConnectionsFixController.setData);

module.exports = dbUpdateConnectionsFix;

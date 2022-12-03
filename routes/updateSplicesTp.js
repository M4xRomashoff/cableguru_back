var express = require('express');
const dbUpdateSplicesTp = new express.Router();
const dbUpdateSplicesTpController = require('../controllers/dbUpdateTpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateSplicesTp.post('/', ensureToken, dbUpdateSplicesTpController.updateSplices);

module.exports = dbUpdateSplicesTp;

var express = require('express');
const dbUpdateSplicesSp = new express.Router();
const dbUpdateSplicesSpController = require('../controllers/dbUpdateSpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateSplicesSp.post('/', ensureToken, dbUpdateSplicesSpController.updateSplices);

module.exports = dbUpdateSplicesSp;

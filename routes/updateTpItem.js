var express = require('express');
const dbUpdateTpItem = new express.Router();
const dbUpdateTpItemController = require('../controllers/dbUpdateTpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateTpItem.post('/', ensureToken, dbUpdateTpItemController.setData);

module.exports = dbUpdateTpItem;

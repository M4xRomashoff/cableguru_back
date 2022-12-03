var express = require('express');
const dbDeleteTpItem = new express.Router();
const dbDeleteTpItemController = require('../controllers/dbDeleteTpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbDeleteTpItem.delete('/', ensureToken, dbDeleteTpItemController.deleteData);

module.exports = dbDeleteTpItem;

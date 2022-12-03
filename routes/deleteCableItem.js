var express = require('express');
const dbDeleteCableItem = new express.Router();
const dbDeleteCableItemController = require('../controllers/dbDeleteCableItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbDeleteCableItem.delete('/', ensureToken, dbDeleteCableItemController.setData);

module.exports = dbDeleteCableItem;

var express = require('express');
const dbUpdateCableItem = new express.Router();
const dbUpdateCableItemController = require('../controllers/dbUpdateCableItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateCableItem.post('/', ensureToken, dbUpdateCableItemController.setData);

module.exports = dbUpdateCableItem;

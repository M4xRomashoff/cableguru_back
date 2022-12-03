var express = require('express');
const dbAddCableItem = new express.Router();
const dbAddCableItemController = require('../controllers/dbAddCableItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbAddCableItem.post('/', ensureToken, dbAddCableItemController.setData);

module.exports = dbAddCableItem;

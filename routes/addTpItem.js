var express = require('express');
const dbAddTpItem = new express.Router();
const dbAddTpItemController = require('../controllers/dbAddTpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbAddTpItem.post('/', ensureToken, dbAddTpItemController.setData);

module.exports = dbAddTpItem;

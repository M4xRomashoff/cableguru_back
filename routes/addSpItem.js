var express = require('express');
const dbAddSpItem = new express.Router();
const dbAddSpItemController = require('../controllers/dbAddSpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbAddSpItem.post('/', ensureToken, dbAddSpItemController.setData);

module.exports = dbAddSpItem;

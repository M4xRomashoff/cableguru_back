var express = require('express');
const dbUpdateSpItem = new express.Router();
const dbUpdateSpItemController = require('../controllers/dbUpdateSpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateSpItem.post('/', ensureToken, dbUpdateSpItemController.setData);

module.exports = dbUpdateSpItem;

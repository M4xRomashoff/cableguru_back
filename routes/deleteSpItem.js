var express = require('express');
const dbDeleteSpItem = new express.Router();
const dbDeleteSpItemController = require('../controllers/dbDeleteSpItemController');
const { ensureToken } = require('../middleware/ensureToken');

dbDeleteSpItem.delete('/', ensureToken, dbDeleteSpItemController.setData);

module.exports = dbDeleteSpItem;

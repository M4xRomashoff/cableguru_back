var express = require('express')
const dbTpRouter = new express.Router()
const dbTpController = require('../controllers/dbTpController');
const { ensureToken } = require('../middleware/ensureToken');

dbTpRouter.get('/:dbName', ensureToken, dbTpController.getAll)

module.exports = dbTpRouter
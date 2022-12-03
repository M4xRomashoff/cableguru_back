var express = require('express')
const dbCableRouter = new express.Router()
const dbCableController = require('../controllers/dbCableController');
const { ensureToken } = require('../middleware/ensureToken');

dbCableRouter.get('/:dbName', ensureToken, dbCableController.getAll)

module.exports = dbCableRouter
var express = require('express')
const dbSpRouter = new express.Router()
const dbSpController = require('../controllers/dbSpController');
const { ensureToken } = require('../middleware/ensureToken');

dbSpRouter.get('/:dbName', ensureToken, dbSpController.getAll)

module.exports = dbSpRouter
var express = require('express');
const dbTpFcsRouter = new express.Router();
const dbTpFcsController = require('../controllers/dbTpFcsController');
const { ensureToken } = require('../middleware/ensureToken');

dbTpFcsRouter.get('/:dbName', ensureToken, dbTpFcsController.getData);

module.exports = dbTpFcsRouter;

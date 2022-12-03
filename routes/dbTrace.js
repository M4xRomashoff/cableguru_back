var express = require('express');
const dbTraceRouter = new express.Router();
const dbTraceController = require('../controllers/dbTraceController');
const { ensureToken } = require('../middleware/ensureToken');

dbTraceRouter.get('/:dbName,tpId,port', ensureToken, dbTraceController.getTrace);
dbTraceRouter.get('/:dbName', ensureToken, dbTraceController.getTrace);

module.exports = dbTraceRouter;

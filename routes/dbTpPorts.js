var express = require('express');
const dbTpPortsRouter = new express.Router();
const dbTpPortsController = require('../controllers/dbTpPortsController');
const { ensureToken } = require('../middleware/ensureToken');

dbTpPortsRouter.get('/:dbName', ensureToken, dbTpPortsController.getPorts);
dbTpPortsRouter.post('/:dbName', ensureToken, dbTpPortsController.setPorts);

module.exports = dbTpPortsRouter;

var express = require('express');
const dbLogRouter = new express.Router();
const dbLogController = require('../controllers/dbLogController');
const { ensureToken } = require('../middleware/ensureToken');

dbLogRouter.get('/log-file', ensureToken, dbLogController.setData);
dbLogRouter.post('/', ensureToken, dbLogController.setData);

module.exports = dbLogRouter;

var express = require('express');
const dbSpFcsRouter = new express.Router();
const dbSpFcsController = require('../controllers/dbSpFcsController');
const { ensureToken } = require('../middleware/ensureToken');

dbSpFcsRouter.get('/:dbName', ensureToken, dbSpFcsController.getData);

// dbSpFcsRouter.get('/:(dbName,spId)', ensureToken, dbSpFcsController.getData);
// dbSpFcsRouter.get('/:dbName', ensureToken, dbSpFcsController.getData);

module.exports = dbSpFcsRouter;

var express = require('express');
const dbGetProjectOptionsRouter = new express.Router();
const dbGetProjectOptionsController = require('../controllers/dbGetProjectOptionsController');
const { ensureToken } = require('../middleware/ensureToken');

dbGetProjectOptionsRouter.get('/:dbName', ensureToken, dbGetProjectOptionsController.getOne);

module.exports = dbGetProjectOptionsRouter;

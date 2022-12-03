var express = require('express');
const dbChangeStateRouter = new express.Router();
const dbChangeStateController = require('../controllers/dbChangeStateController');
const { ensureToken } = require('../middleware/ensureToken');

dbChangeStateRouter.post('/', ensureToken, dbChangeStateController.changeStateController);

module.exports = dbChangeStateRouter;

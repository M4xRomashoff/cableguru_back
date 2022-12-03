var express = require('express');
const getHistoryRouter = new express.Router();
const getHistoryController = require('../controllers/getHistoryController');
const { ensureToken } = require('../middleware/ensureToken');

getHistoryRouter.get('/:dbName', ensureToken, getHistoryController.getAll);

module.exports = getHistoryRouter;

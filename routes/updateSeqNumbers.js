var express = require('express');
const updateSeqNumbersRouter = new express.Router();
const updateSeqNumbersController = require('../controllers/updateSeqNumbersController');
const { ensureToken } = require('../middleware/ensureToken');

updateSeqNumbersRouter.post('/', ensureToken, updateSeqNumbersController.update);

module.exports = updateSeqNumbersRouter;

var express = require('express');
const getFewSpRouter = new express.Router();
const getFewSpController = require('../controllers/dbSpController');
const { ensureToken } = require('../middleware/ensureToken');

getFewSpRouter.post('/', ensureToken, getFewSpController.getFew);

module.exports = getFewSpRouter;

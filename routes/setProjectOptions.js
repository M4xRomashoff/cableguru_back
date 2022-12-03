var express = require('express');
const dbUpdateProjectOptions = new express.Router();
const dbUpdateProjectOptionsController = require('../controllers/dbGetProjectOptionsController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateProjectOptions.post('/', ensureToken, dbUpdateProjectOptionsController.setOne);

module.exports = dbUpdateProjectOptions;

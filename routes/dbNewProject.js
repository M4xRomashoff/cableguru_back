var express = require('express');
const dbNewProject = new express.Router();
const dbNewProjectController = require('../controllers/dbNewProjectController');
const { ensureToken } = require('../middleware/ensureToken');

dbNewProject.get('/:dbName', ensureToken, dbNewProjectController.createNew);

module.exports = dbNewProject;

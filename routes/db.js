var express = require('express');
const dbRouter = new express.Router();
const dbController = require('../controllers/dbController');
const { ensureToken } = require('../middleware/ensureToken');
const { checkAdmin } = require('../middleware/checkAdmin');

dbRouter.get('/', ensureToken, dbController.getAll);
dbRouter.post('/add-access', ensureToken, checkAdmin, dbController.addAccess);
dbRouter.delete('/remove-access', ensureToken, checkAdmin, dbController.removeAccess);
dbRouter.delete('/remove-access-and-delete', ensureToken, checkAdmin, dbController.removeAccessAndDelete);

module.exports = dbRouter;

var express = require('express');
const dbUpdateTpLatLng = new express.Router();
const dbUpdateTpLatLngController = require('../controllers/dbUpdateTpLatLngController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateTpLatLng.post('/', ensureToken, dbUpdateTpLatLngController.updateTpLatLng);

module.exports = dbUpdateTpLatLng;

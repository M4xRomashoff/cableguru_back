var express = require('express');
const dbUpdateCableLatLng = new express.Router();
const dbUpdateCableLatLngController = require('../controllers/dbUpdateCableLatLngController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateCableLatLng.post('/', ensureToken, dbUpdateCableLatLngController.updateCableLatLng);

module.exports = dbUpdateCableLatLng;

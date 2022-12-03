var express = require('express');
const dbUpdateSpLatLng = new express.Router();
const dbUpdateSpLatLngController = require('../controllers/dbUpdateSpLatLngController');
const { ensureToken } = require('../middleware/ensureToken');

dbUpdateSpLatLng.post('/', ensureToken, dbUpdateSpLatLngController.updateSpLatLng);

module.exports = dbUpdateSpLatLng;

let express = require('express');
const deletePicture = new express.Router();
const deletePictureController = require('../controllers/deletePictureController');
const { ensureToken } = require('../middleware/ensureToken');

deletePicture.delete('/', ensureToken, deletePictureController.deletePicture);

module.exports = deletePicture;

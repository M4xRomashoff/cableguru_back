let express = require('express');
const UploadPicture = new express.Router();
const UploadPictureController = require('../controllers/UploadPictureController');
const { ensureToken } = require('../middleware/ensureToken');

UploadPicture.post('/', ensureToken, UploadPictureController.uploadPicture);


module.exports = UploadPicture;

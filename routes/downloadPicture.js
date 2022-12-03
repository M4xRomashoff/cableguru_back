let express = require('express');
const DownloadPicture = new express.Router();
const downloadPictureController = require('../controllers/downloadPictureController');
const { ensureToken } = require('../middleware/ensureToken');

DownloadPicture.get('/:dbName', ensureToken, downloadPictureController.downloadPicture);

module.exports = DownloadPicture;

let express = require('express');
const DownloadDocument = new express.Router();
const downloadDocumentController = require('../controllers/downloadDocumentController');
const { ensureToken } = require('../middleware/ensureToken');

DownloadDocument .get('/:dbName', ensureToken, downloadDocumentController.downloadDocumentLinks);
DownloadDocument .get('/:link/link', ensureToken, downloadDocumentController.downloadDocument);

module.exports = DownloadDocument ;

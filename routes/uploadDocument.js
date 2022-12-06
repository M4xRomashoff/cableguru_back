let express = require('express');
const UploadDocument = new express.Router();
const UploadDocumentController = require('../controllers/UploadDocumentController');
const { ensureToken } = require('../middleware/ensureToken');

UploadDocument.post('/', ensureToken, UploadDocumentController.uploadDocument);


module.exports = UploadDocument;

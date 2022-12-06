let express = require('express');
const deleteDocument = new express.Router();
const deleteDocumentController = require('../controllers/deleteDocumentController');
const { ensureToken } = require('../middleware/ensureToken');

deleteDocument.delete('/', ensureToken, deleteDocumentController.deleteDocument);

module.exports = deleteDocument;

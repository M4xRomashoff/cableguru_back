const { sendStatusData } = require('../utils/sendStatusData');
const dbDeleteDocumentService = require('../services/dbNewProjectService');
const fs = require('fs');

module.exports = {
  async deleteDocument(req, res) {
    try {
      if (req.body.dbName ) {
        const dbName = req.body.dbName;
        const userId = req.body.userId;
        const dir = req.body.dir;
        const file_id =req.body.id;

        try {
          fs.unlinkSync('./public/' + dir);
        } catch (err) {
          console.error(err);
        }

        const result = await dbDeleteDocumentService.deleteDocument(dbName, file_id);
        if (result?.warningStatus === 0 || result === 'ok') return sendStatusData(res, 200);
        return sendStatusData(res, 501, result);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

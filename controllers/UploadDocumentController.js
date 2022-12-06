const { sendStatusData } = require('../utils/sendStatusData');
const dbAddDocumentService = require('../services/dbNewProjectService');
const fs = require('fs');

module.exports = {
  async uploadDocument(req, res) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded',
        });
      } else {
        const dbName = req.headers.dbname;
        const userId = req.headers.userid;
        const userName = req.headers.username;

        let dir = './public/uploadedDocuments/';

        if (!fs.existsSync(dir)) {
          await fs.mkdirSync(dir);
        }
        dir = './public/uploadedDocuments/' + dbName + '/';
        if (!fs.existsSync(dir)) {
          await fs.mkdirSync(dir);
        }

        let avatar = req.files.file;
        let fileName = req.body.title;
        await avatar.mv(dir + fileName);

        const result = await dbAddDocumentService.addDocument((dir + fileName).slice(8), userId, dbName, userName, fileName);
        if (result?.warningStatus === 0 || result === 'ok') return sendStatusData(res, 200);
        return sendStatusData(res, 501, result);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

const { sendStatusData } = require('../utils/sendStatusData');
const dbGetDocumentService = require('../services/dbNewProjectService');
const __dir = require('path').dirname(require.main.filename)
const fs = require('fs');



module.exports = {
  async downloadDocumentLinks(req, res) {
    try {
      const dbName = req.params.dbName;

      if (dbName !== '') {
        const result = await dbGetDocumentService.getDocument(dbName);
        if (result.length > 0) return sendStatusData(res, 200, result);
        return sendStatusData(res, 501);
      } else {
        return sendStatusData(res, 200, 'no documents');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async downloadDocument(req, res) {

    try {
      const [link] = req.params.link;

      const path = __dir+'/public'+ link;
      if (fs.existsSync(path)){
        res.sendFile(path);
      } else {
        return sendStatusData(res, 200, 'no document');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};


//  async check file exists

// fs.access(path, fs.F_OK, (err) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//
//   //file exists
// })

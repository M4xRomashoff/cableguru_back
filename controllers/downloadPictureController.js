const { sendStatusData } = require('../utils/sendStatusData');
const dbGetPictureService = require('../services/dbNewProjectService');
const __dir = require('path').dirname(require.main.filename)
const fs = require('fs');



module.exports = {
  async downloadPictureLinks(req, res) {
    try {
      const [dbName, id, type] = req.params.dbName.split(',');

      if (dbName !== '' && parseInt(id) > 0 && (type === 'sp' || type === 'tp')) {
        const result = await dbGetPictureService.getPicture(dbName, id, type);
        if (result.length > 0) return sendStatusData(res, 200, result);
        return sendStatusData(res, 501);
      } else {
        return sendStatusData(res, 200, 'no pictures');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async downloadPicture(req, res) {

    try {
      const [dbName, link] = req.params.dbName.split(',');
      console.log('link',link);
      const path = __dir+'/public'+ link;
      console.log('__dirname',__dir);
      if (fs.existsSync(path)){
        console.log('file exits sending');
        res.sendFile(path);
        //return sendStatusData(200);
      } else {
        return sendStatusData(res, 200, 'no pictures');
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

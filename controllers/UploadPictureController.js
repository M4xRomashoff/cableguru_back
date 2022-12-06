const { sendStatusData } = require('../utils/sendStatusData');
const dbAddPictureService = require('../services/dbNewProjectService');
const fs = require('fs');

module.exports = {
  async uploadPicture(req, res) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded',
        });
      } else {
        const dbName = req.headers.dbname;
        const itemType = req.headers.itemtype + '_';
        const itemId = req.headers.itemid;
        const userId = req.headers.userid;
        const userName = req.headers.username;

        // let dir = './public/uploadedPictures/';
        let dir = '/root/uploadedPictures/';
        if (!fs.existsSync(dir)) {
          await fs.mkdirSync(dir);
        }
        dir = '/root/uploadedPictures/' + dbName + '/';
        if (!fs.existsSync(dir)) {
          await fs.mkdirSync(dir);
        }

        dir = '/root/uploadedPictures/' + dbName + '/' + (itemType + itemId) + '/';
        if (!fs.existsSync(dir)) {
          await fs.mkdirSync(dir);
        }
        let avatar = req.files.file;
        let fileName = req.body.title;
        await avatar.mv(dir + fileName);

        const result = await dbAddPictureService.addPicture((dir + fileName).slice(8), userId, dbName, itemType.slice(0, 2), itemId, userName);
        if (result?.warningStatus === 0 || result === 'ok') return sendStatusData(res, 200);
        return sendStatusData(res, 501, result);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

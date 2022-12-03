const { sendStatusData } = require('../utils/sendStatusData');
const dbDeletePictureService = require('../services/dbNewProjectService');
const fs = require('fs');

module.exports = {
  async deletePicture(req, res) {
    try {
      if (req.body.itemId && req.body.dbName && req.body.itemType) {
        const dbName = req.body.dbName;
        const itemType = req.body.itemType;
        const itemId = req.body.itemId;
        const userId = req.body.userId;
        const dir = req.body.dir;

        try {
          fs.unlinkSync('./public/' + dir);
        } catch (err) {
          console.error(err);
        }

        const result = await dbDeletePictureService.deletePicture(userId, dbName, itemType, itemId, dir);
        if (result?.warningStatus === 0 || result === 'ok') return sendStatusData(res, 200);
        return sendStatusData(res, 501, result);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

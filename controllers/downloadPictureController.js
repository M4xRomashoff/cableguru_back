const { sendStatusData } = require('../utils/sendStatusData');
const dbGetPictureService = require('../services/dbNewProjectService');
const fs = require('fs');

module.exports = {
  async downloadPicture(req, res) {
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
};

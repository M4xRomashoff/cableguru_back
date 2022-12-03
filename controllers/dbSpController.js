const { sendStatusData } = require('../utils/sendStatusData');
const dbSpService = require('../services/dbSpService');

module.exports = {
  async getAll(req, res) {
    const dbName = req?.params?.dbName;

    const data = await dbSpService.findAll(dbName);

    if (Array.isArray(data)) return sendStatusData(res, 200, data);

    return sendStatusData(res, 501);
  },

  async getFew(req, res) {
    const dbName = req?.body.dbName;
    const spList = req.body.itemList;
    const data = await dbSpService.findFew(dbName, spList);
    if (Array.isArray(data)) return sendStatusData(res, 200, data);
    return sendStatusData(res, 501);
  },
};

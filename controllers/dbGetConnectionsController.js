const { sendStatusData } = require('../utils/sendStatusData');
const dbGetConnectionsService = require('../services/dbGetConnectionsService');

module.exports = {
  async getAll(req, res) {
    const dbName = req?.params?.dbName;

    const data = await dbGetConnectionsService.findAll(dbName);

    if (Array.isArray(data)) return sendStatusData(res, 200, data);

    return sendStatusData(res, 501);
  },
};

const { sendStatusData } = require('../utils/sendStatusData');
const dbTpService = require('../services/dbTpService');

module.exports = {
  async getAll(req, res) {
    const dbName = req?.params?.dbName;
    const tpData = await dbTpService.findAll(dbName);
    if (Array.isArray(tpData)) return sendStatusData(res, 200, tpData);
    return sendStatusData(res, 501);
  },
  async getOne(dbName, tpId) {
    const tpData = await dbTpService.findOne(dbName, tpId);
    if (Array.isArray(tpData)) return tpData;
    return [];
  },
};

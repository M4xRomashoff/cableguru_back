const { sendStatusData } = require('../utils/sendStatusData');
const dbCableService = require('../services/dbCableService');
const dbTpService = require('../services/dbTpService');

module.exports = {
  async getAll(req, res) {
    const dbName = req?.params?.dbName;
    const cables = await dbCableService.findAll(dbName);

    if (Array.isArray(cables)) return sendStatusData(res, 200, cables);

    return sendStatusData(res, 501);
  },
  async getOne(dbName, cabId) {
    const tpData = await dbCableService.getOneCable(dbName, cabId);
    if (Array.isArray(tpData)) return tpData;
    return [];
  },
};

const { sendStatusData } = require('../utils/sendStatusData');
const getHistoryService = require('../services/getHistoryService');

module.exports = {
  async getAll(req, res) {
    const dbName = req?.params?.dbName;
    const history = await getHistoryService.findAll(dbName);
    if (Array.isArray(history)) return sendStatusData(res, 200, history);
    return sendStatusData(res, 501);
  },
};

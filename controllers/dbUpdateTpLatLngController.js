const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateTpLatLngService = require('../services/dbUpdateTpLatLngService');

module.exports = {
  async updateTpLatLng(req, res) {
    const data = {
      dbName: req.body.dbName,
      userId: req.body.userId,
      data: JSON.parse(req.body.data),
    };
    const result = await dbUpdateTpLatLngService.updateTpLatLng(data);
    if (result?.warningStatus === 0 || 'ok') return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};

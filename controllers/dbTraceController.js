const { sendStatusData } = require('../utils/sendStatusData');
const dbTraceService = require('../services/dbTraceService');

module.exports = {
  async getTrace(req, res) {
    const arr = req?.params?.dbName?.split(',');
    if (arr.length > 2) {
      const dbName = arr[0];
      const tpId = parseInt(arr[1]);
      const port = parseInt(arr[2].slice(4));
      const traceData = await dbTraceService.findTrace(dbName, tpId, port);
      if (Array.isArray(traceData)) return sendStatusData(res, 200, traceData);
      return sendStatusData(res, 501);
    } else return sendStatusData(res, 200, 'error: nothing to trace');
  },
};

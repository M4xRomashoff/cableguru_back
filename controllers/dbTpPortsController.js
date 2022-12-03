const { sendStatusData } = require('../utils/sendStatusData');
const dbTpPortsService = require('../services/dbTpPortsService');

module.exports = {
  async getPorts(req, res) {
    try {
      const array = req?.params?.dbName.split(',');
      const dbName = array[0];
      const tpId = array[1];

      const dataFromTp = await dbTpPortsService.getTpPorts(dbName, tpId);
      if (Array.isArray(dataFromTp)) return sendStatusData(res, 200, dataFromTp);
      else sendStatusData(res, 501, dataFromTp);
    } catch (e) {
      return sendStatusData(res, 501, e);
    }
  },
  async setPorts(req, res) {
    try {
      const dbName = req.body.dbName;
      const tpId = req.body.tpId;
      const portsData = JSON.parse(req.body.ports);
      const response = await dbTpPortsService.setTpPorts(dbName, tpId, portsData);
      if (response.insertId > 0) sendStatusData(res, 200, 'ok');
      else {
        sendStatusData(res, 501, 'not ok');
      }
    } catch (e) {
      return sendStatusData(res, 501, e);
    }
  },
};

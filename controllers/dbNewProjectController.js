const { sendStatusData } = require('../utils/sendStatusData');
const dbNewProjectService = require('../services/dbNewProjectService');

module.exports = {
  async createNew(req, res) {
    const dbName = req?.params?.dbName;
    const Data = await dbNewProjectService.createNew(dbName);
    const Data2 = await dbNewProjectService.addToProjectOptions(dbName);

    if (Array.isArray(Data)) return sendStatusData(res, 200, Data);
    return sendStatusData(res, 501);
  },
};

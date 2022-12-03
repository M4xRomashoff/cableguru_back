const { sendStatusData } = require('../utils/sendStatusData');
const dbService = require('../services/dbService');

module.exports = {
  async getAll(req, res) {
    const dataBases = await dbService.findAll();
    if (Array.isArray(dataBases))
      return sendStatusData(
        res,
        200,
        dataBases.map(({ Database }) => ({ dbName: Database })),
      );
    return sendStatusData(res, 501);
  },

  async addAccess(req, res) {
    const addAccessArray = req.body.dbNames.map((dbName) => [req.body.user_id, dbName, req.body.access_level]);
    const result = await dbService.addAccess(addAccessArray);
    if (result?.id) return sendStatusData(res, 200);
    return sendStatusData(res, result.affectedRows > 0 ? 200 : 500, result);
  },

  async removeAccess(req, res) {
    const deleteDbNames = req.body.dbNames.map((dbName) => [dbName]);
    const removedIds = await dbService.removeAccess(req.body.user_id, deleteDbNames);
    return sendStatusData(res, removedIds.affectedRows > 0 ? 200 : 500, 'fail to remove project');
  },

  async removeAccessAndDelete(req, res) {
    const deleteDbNames = req.body.dbNames.map((dbName) => [dbName]);
    const affectedRows = await dbService.removeAccess(req.body.user_id, deleteDbNames);
    const deletedDbs = await dbService.deleteDbs(req.body.user_id, deleteDbNames);
    console.log('deleteDbNames controller', deleteDbNames);
    const updateOptions = await dbService.updateOptionsDbs(req.body.user_id, deleteDbNames);

    return sendStatusData(res, deletedDbs > 0 ? 200 : 500, 'fail to delete project');
  },
};

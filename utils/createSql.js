module.exports = {
  createSql(db, table) {
    const newdb = db.replace("'", '');
    const sql = 'SELECT * FROM ';
    return sql.concat(newdb, table);
  },

  createSqlFcsConnectionsSp(db, table, spId) {
    const newdb = db.replace("'", '');
    const spIdString = ' WHERE sp_id=' + spId;
    const sql = 'SELECT * FROM ';
    return sql.concat(newdb, table, spIdString);
  },

  createSqlFcsConnectionsTp(db, table, tpId) {
    const newdb = db.replace("'", '');
    const tpIdString = ' WHERE tp_id=' + tpId;
    const sql = 'SELECT * FROM ';
    return sql.concat(newdb, table, tpIdString);
  },
  createSqlFcsCables(db, table, cables) {
    const newdb = db.replace("'", '');
    const cableIdString = ' WHERE id IN(' + cables + ')';
    const sql = 'SELECT * FROM ';
    return sql.concat(newdb, table, cableIdString);
  },
  createSqlFcs(db, spId) {
    const newdb = db.replace("'", '');
    const idString = '.sp_' + spId.toString();
    const sql = 'SELECT * FROM ';
    return sql.concat(newdb, idString);
  },
  createSqlFcsTp(db, tpId) {
    const newdb = db.replace("'", '');
    const idString = '.tp_' + tpId.toString();
    const sql = 'SELECT * FROM ';
    return sql.concat(newdb, idString);
  },
};

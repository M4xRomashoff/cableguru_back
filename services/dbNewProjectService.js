const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  createNew(name) {
    const result1 = DataBases('CREATE DATABASE ' + name, []);
    const result2 = DataBases('USE ' + name, []);
    const result3 = DataBases(databaseString1, []);
    const result4 = DataBases(databaseString2, []);
    const result5 = DataBases(databaseString3, []);
    const result6 = DataBases(databaseString4, []);
    const result7 = DataBases(databaseString5, []);
    return [result1, result2, result3, result4, result5, result6, result7];
  },
  addToProjectOptions(name) {
    let sql =
      'CREATE TABLE IF NOT EXISTS users.project_options' +
      ' ( id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
      ' name VARCHAR(100)  DEFAULT "none" ,' +
      ' coefficient VARCHAR(30)  DEFAULT "1.25" ,' +
      ' att1310 VARCHAR(30)  DEFAULT "0.35" ,' +
      ' att1550 VARCHAR(30)  DEFAULT "0.25" ,' +
      ' spliceLoss VARCHAR(30)  DEFAULT "0.1" ,' +
      ' connectorLoss VARCHAR(30)  DEFAULT "0.5" );';

    const res1 = DataBases(sql, []);
    sql = 'INSERT INTO users.project_options ( name ) VALUES ( "' + name + '" ) ;';
    const res2 = DataBases(sql, []);
    return res2;
  },
  addPicture(dir, userId, dbName, itemType, itemId, userName) {
    let sql =
      'CREATE TABLE IF NOT EXISTS ' +
      dbName +
      '.pictures' +
      ' ( id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
      ' dir VARCHAR(200)  DEFAULT "none" ,' +
      ' item_type VARCHAR(30)  DEFAULT "none" ,' +
      ' item_id VARCHAR(30)  DEFAULT "none" ,' +
      ' user_id VARCHAR(30)  DEFAULT "none" ,' +
      ' date DATETIME DEFAULT CURRENT_TIMESTAMP ,' +
      ' user_name VARCHAR(100)  DEFAULT "none" );';

    const res1 = DataBases(sql, []);
    sql = 'INSERT INTO ' + dbName + '.pictures ( dir, item_type, item_id, user_id, user_name ) VALUES ( "' + dir + '", "' + itemType + '", "' + itemId + '", "' + userId + '", "' + userName + '" ) ;';
    const res = DataBases(sql, []);
    return res;
  },
  getPicture(dbName, itemId, itemType) {
    let sql = 'SELECT * FROM ' + dbName + '.pictures WHERE item_id =' + itemId + ' AND item_type ="' + itemType + '";';
    const res = DataBases(sql, []);
    return res;
  },
  deletePicture(userId, dbName, itemType, itemId, dir) {
    let sql = 'DELETE FROM ' + dbName + '.pictures WHERE item_id =' + itemId + ' AND item_type ="' + itemType + '" AND dir ="' + dir + '" ' + ' AND user_id ="' + userId + '";';

    const res = DataBases(sql, []);
    return res;
  },

  addDocument(dir, userId, dbName, userName, fileName) {
    let sql =
        'CREATE TABLE IF NOT EXISTS ' +
        dbName +
        '.documents' +
        ' ( id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
        ' dir VARCHAR(200)  DEFAULT "none" ,' +
        ' user_id VARCHAR(30)  DEFAULT "none" ,' +
        ' date DATETIME DEFAULT CURRENT_TIMESTAMP ,' +
        ' file_name VARCHAR(100)  DEFAULT "none" ,' +
        ' user_name VARCHAR(100)  DEFAULT "none" );';


    const res1 = DataBases(sql, []);
    sql = 'INSERT INTO ' + dbName + '.documents ( dir, user_id, user_name, file_name ) VALUES ( "' + dir + '", "' + userId + '", "' + userName + '", "' + fileName + '" ) ;';
    const res = DataBases(sql, []);
    return res;
  },
  getDocument(dbName) {
    let sql = 'SELECT * FROM ' + dbName + '.documents ;';
    const res = DataBases(sql, []);
    return res;
  },
  deleteDocument(dbName, file_id) {
    let sql = 'DELETE FROM ' + dbName + '.documents WHERE id =' + file_id +';';

    const res = DataBases(sql, []);
    return res;
  },
};

const databaseString1 =
  ' CREATE TABLE tp (' +
  ' id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  ' current_status SMALLINT DEFAULT 0 , ' +
  ' name_id VARCHAR(50) NULL DEFAULT NULL , ' +
  ' mfg VARCHAR(100) NULL DEFAULT NULL , ' +
  ' model VARCHAR(100) NULL DEFAULT NULL , ' +
  ' capacity VARCHAR(100)  NULL DEFAULT NULL , ' +
  " connector VARCHAR(100)  NULL DEFAULT 'SM' ," +
  ' owner VARCHAR(50)  NULL DEFAULT NULL ,' +
  ' address VARCHAR(200)  NULL DEFAULT NULL  ,' +
  ' access VARCHAR(100)  NULL DEFAULT NULL , ' +
  ' birthday DATETIME DEFAULT CURRENT_TIMESTAMP ,' +
  ' last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,' +
  ' latitude  VARCHAR(100)  NULL DEFAULT NULL,' +
  ' longitude VARCHAR(100)  NULL DEFAULT NULL );';
const databaseString2 =
  ' CREATE TABLE sp (' +
  ' id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  ' current_status SMALLINT DEFAULT 0 , ' +
  ' name_id VARCHAR(50) NULL DEFAULT NULL , ' +
  ' mfg VARCHAR(100) NULL DEFAULT NULL , ' +
  ' model VARCHAR(100) NULL DEFAULT NULL, ' +
  ' capacity VARCHAR(100)  NULL DEFAULT NULL ,' +
  ' spl_type VARCHAR(100)  NULL DEFAULT NULL ,' +
  ' mount VARCHAR(100)  NULL DEFAULT NULL , ' +
  ' address VARCHAR(200)  NULL DEFAULT NULL  ,' +
  ' birthday DATETIME DEFAULT CURRENT_TIMESTAMP ,' +
  ' last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,' +
  ' latitude  VARCHAR(100)  NULL DEFAULT NULL ,' +
  ' longitude VARCHAR(100)  NULL DEFAULT NULL  ,' +
  ' owner VARCHAR(50)  NULL DEFAULT NULL  );';
const databaseString3 =
  'CREATE TABLE cable (' +
  ' id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  ' name_id VARCHAR(50) NULL DEFAULT NULL , ' +
  ' mfg VARCHAR(100) NULL DEFAULT NULL , ' +
  ' model VARCHAR(100) NULL DEFAULT NULL , ' +
  ' capacity VARCHAR(100)  NULL DEFAULT NULL ,' +
  ' f_type VARCHAR(100)  NULL DEFAULT NULL ,' +
  ' p_type VARCHAR(100)  NULL DEFAULT NULL , ' +
  ' c_type VARCHAR(200)  NULL DEFAULT NULL  ,' +
  ' birthday  DATETIME DEFAULT CURRENT_TIMESTAMP ,' +
  ' last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,' +
  ' points TEXT  NULL DEFAULT NULL ,' +
  ' owner VARCHAR(50)  NULL DEFAULT NULL  ,' +
  ' current_status SMALLINT DEFAULT 0);';
const databaseString4 =
  'CREATE TABLE connections (' +
  ' id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  ' cab_id   BIGINT UNSIGNED ,' +
  ' sp_id   BIGINT UNSIGNED ,' +
  ' tp_id   BIGINT UNSIGNED ,' +
  ' point   BIGINT UNSIGNED,' +
  ' ring BIT DEFAULT 0,' +
  ' seq   BIGINT UNSIGNED DEFAULT 0,' +
  ' seq_h   BIGINT UNSIGNED DEFAULT 0);';

const databaseString5 =
  'CREATE TABLE log (' +
  ' id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,' +
  ' user_id BIGINT  NOT NULL DEFAULT 0, ' +
  ' item VARCHAR(100) NULL DEFAULT NULL ,  ' +
  ' date_created  DATETIME DEFAULT CURRENT_TIMESTAMP , ' +
  ' action VARCHAR(100) NULL DEFAULT NULL ,  ' +
  ' comments TEXT  DEFAULT NULL   );';

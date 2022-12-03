const promiseDb = require('../utils/promiseDb');
const { dbUsers } = require('../config/config');

const User = promiseDb.makeDb(dbUsers);

module.exports = {
  findById(userId) {
    return User('SELECT * FROM userlist WHERE id = ?', [userId]);
  },
  findByUserName({ userName }) {
    return User('SELECT * FROM userlist WHERE user_name=?', [userName]);
  },
  findAll() {
    return User('SELECT ALL * FROM userlist;');
  },
  addUser(records) {    
    return User('INSERT INTO userlist (user_name, pwd, hint, user_email, phone, company, access_level) VALUES(?);', [records]);
  },
  deleteUser(userId) {    
    return User('DELETE FROM userlist WHERE id=?;', [userId]);
  },
  getUsersDb(userId) {    
    return User('SELECT * FROM listdbaccess WHERE user_id=?', userId);
  },
};
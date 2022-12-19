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
  updateUser(rec) {

    return User('UPDATE userlist SET user_name = "' + rec.name + '", ' +
                                           'user_email = "' + rec.email + '", ' +
                                           'phone = "' + rec.phone + '", '+
                                           'company = "' + rec.company + '" '+
        'WHERE id = '+rec.id + ';', []);
  },
  updateUserPass(rec) {

    return User('UPDATE userlist SET pwd = "' + rec.hashedPassword + '", '+
                                    'hint = "'+ rec.password_hint + '" '+
                                    'WHERE id = '+rec.id + ';', []);
  },

  deleteUser(userId) {    
    return User('DELETE FROM userlist WHERE id=?;', [userId]);
  },
  getUsersDb(userId) {    
    return User('SELECT * FROM listdbaccess WHERE user_id=?', userId);
  },
};
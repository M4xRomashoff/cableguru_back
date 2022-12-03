var mysql = require('mysql2')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', //
  password: 'Twenty22!', //
  database: 'sample1',
})
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})
module.exports = connection
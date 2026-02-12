const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

connection.connect(err => {
  if (err) {
    console.error('Error DB:', err);
  } else {
    console.log('DB conectada');
  }
});

module.exports = connection;

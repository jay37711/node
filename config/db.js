const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'bkormmq4wmbzhzke70o5-mysql.services.clever-cloud.com',
  user: 'utmkt20gg2hzslro',
  password: 'E2OU0cQ37eY0w0fj7BCm',
  database: 'bkormmq4wmbzhzke70o5'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

module.exports = db;

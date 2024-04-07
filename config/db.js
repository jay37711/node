const mysql = require('mysql');
const os = require('os');
const hostname = os.hostname();
if(hostname == 'DESKTOP-QJD0DAS'){
  var host = 'localhost'
  var user = 'root'
  var password = ''
  var databse = 'chit_chat'
}else{
  var host = 'bkormmq4wmbzhzke70o5-mysql.services.clever-cloud.com'
  var user = 'utmkt20gg2hzslro'
  var password = 'E2OU0cQ37eY0w0fj7BCm'
  var databse = 'bkormmq4wmbzhzke70o5'
}

const db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: databse
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

module.exports = db;

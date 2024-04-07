const mysql = require('../config/db');
const bcrypt = require('bcrypt');
const util = require('util');
const crypto = require('crypto');
const os = require('os');
const hostname = os.hostname();
const queryAsync = util.promisify(mysql.query).bind(mysql);

exports.create_room = async (req, res) => {
  console.log('hostname',hostname);

  const username = req.body.username;
  const password = req.body.password;
  const roomNAme = req.body.roomName;

  if (!username || !password || !roomNAme) {
    return res.status(400).json({ message: 'Username and password and room_name are required' });
  }
  const uniqueHash = generateUniqueHash();
  
  mysql.query('SELECT `id` FROM `rooms` WHERE `room_name` = ?',[roomNAme],(error,result,fields) => {
    if (error) {
      console.error('MySQL query error: ' + error.stack);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
   console.log(result)
    if (result.length > 0) {
      return res.status(400).json({ message: 'Room Already Exists'});
    }else{
      insertUserQuery = 'INSERT INTO `rooms` SET `room_name` = ? , `creator_id` = ? ,`creator_name` = ? , `unique_id` = ?, `password` = ?';
      mysql.query(insertUserQuery, [roomNAme, 0, username, uniqueHash, password], (insertError, result) => {
          if (insertError) {
            console.error('MySQL query error: ' + insertError.stack);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
          res.status(201).json('success');
      });
    }
  });
};

function generateUniqueHash() {
    const randomString = Math.random().toString(36).substring(2);
    const hash = crypto.createHash('sha256');
    hash.update(randomString);
    const uniqueHash = hash.digest('hex');
    return uniqueHash;
}

exports.join_room = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const roomNAme = req.body.roomName;

  if (!username || !password || !roomNAme) {
    return res.status(400).json({ message: 'Username and password and room_name are required' });
  }

  mysql.query('SELECT `id`,`password` FROM `rooms` WHERE `room_name` = ?',[roomNAme],(error,result,fields) => {
    if (error) {
      console.error('MySQL query error: ' + error.stack);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.length > 0) {
      console.log(result)
      if(result[0].password == password){
        res.status(201).json('success');
      }else{
        return res.status(400).json({ message: 'Incorrect Password'});
      }
    }else{
      return res.status(400).json({ message: 'Room not Exists'});
    }
  });
  
}
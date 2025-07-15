// baby-names-backend/models/userModel.js
const db = require('../config/db');

const createUser = (user, callback) => {
  const { username, email, password, role } = user;
  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.run(sql, [username, email, password, role], callback);
};

const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], callback);
};

module.exports = { createUser, getUserByEmail };

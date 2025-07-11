 const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./baby_names.db');

const hashedPassword = bcrypt.hashSync('123456', 10);

db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
  ['admin', hashedPassword, 'admin'],
  (err) => {
    if (err) console.error(err);
    else console.log('Test admin user created');
    db.close();
  }
);

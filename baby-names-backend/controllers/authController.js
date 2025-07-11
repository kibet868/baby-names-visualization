 const bcrypt = require('bcryptjs');
const db = require('..');

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [username, email, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ message: 'Username already exists.' });
      }
      return res.status(500).json({ message: 'Registration failed.', error: err.message });
    }

    res.status(201).json({ message: 'User registered successfully!', userId: this.lastID });
  });
};

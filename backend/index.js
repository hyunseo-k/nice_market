const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000; // Choose a port number

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rkdgustj7!',
  database: 'nice',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const query = 'INSERT INTO Users (email, password) VALUES (?, ?)';
    db.query(query, [email, password], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Database error' });
      } else {
        res.status(200).json({ message: 'Sign up successful' });
      }
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM Users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ message: 'Database error' });
    } else if (result.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      res.status(200).json({ message: 'Login successful', user: result[0] });
    }
  });
});

app.post('/dup', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT COUNT(*) AS count FROM Users WHERE email = ?';
    
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Database error' });
      } else {
        const isDuplicate = result[0].count > 0;
        res.status(200).json({ isDuplicate });
      }
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

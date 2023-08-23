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
    const query = 'INSERT INTO Users (email, password, cart) VALUES (?, ?, ?)';
    let valuesToInsert= [email,password,"[]"];
    db.query(query, valuesToInsert, (err, result) => {
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


app.post('/:user_id/add', (req, res) => {
  const { user_id } = req.params;
  const { product_id, quantity } = req.body;

  // 이 부분에서 카트 정보 업데이트 로직을 작성하세요.
  // 쿼리를 통해 해당 사용자의 카트 정보를 업데이트하고, 새로운 제품을 추가합니다.

  const updateQuery  = `
    UPDATE Users
    SET cart = JSON_ARRAY_APPEND(cart, '$', JSON_OBJECT('product_id', ?, 'quantity', ?))
    WHERE user_id = ?
  `;

  db.query(updateQuery, [product_id, quantity, user_id], (updateErr, updateResult) => {
    // console.error("up2", product_id);
    console.error("qe", updateResult);
    if (updateErr) {
      console.error('Database update query error:', updateErr);
      res.status(500).json({ message: 'Database error' });
    } else {
      const selectQuery = 'SELECT * FROM Users WHERE user_id = ?';
  
      db.query(selectQuery, [user_id], (selectErr, selectResult) => {
        if (selectErr) {
          console.error('Database select query error:', selectErr);
          res.status(500).json({ message: 'Database error' });
        } else {
          const updatedUser = selectResult[0];
          console.error("up", updatedUser);
          res.status(200).json({ message: 'Product added to cart', user: updatedUser });
        }
      });
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


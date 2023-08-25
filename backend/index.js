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

app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/order', (req, res) => {
//   // console.log(req.body);
//   const { resultMsg, amount, paidAt, cardName } = req.body;
//   console.log(amount);
//   if(resultMsg==="정상 처리되었습니다."){
//     res.send("결제에 성공했습니다.");
//   } else {
//     res.send("결제에 실패하였습니다.");
//   }
// });

// app.post('/make-order', (req, res) => {
//   // console.log(req.body);
//   const { resultMsg, amount, paidAt, cardName } = req.body;
//   console.log(amount);
//   if(resultMsg==="정상 처리되었습니다."){
//     res.send("결제에 성공했습니다.");
//   } else {
//     res.send("결제에 실패하였습니다.");
//   }
// });
const random = (length = 8) => {
  return Math.random().toString(16).substr(2, length);
};

app.post('/done-order', async (req, res) => {
  const { resultMsg, amount, paidAt } = req.body;
  console.log("rr", paidAt);
})

app.post('/make-order', async (req, res) => {
  var id = random();
  const { totalPrice } = req.body;
  try {
    const url = 'https://sandbox-api.nicepay.co.kr/v1/checkout';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic UzFfY2UxYmIxZWJlYmM0NGZlMWEzZjdjZWM5NzZjODNlYTc6MTNlOTY5YTc3YTA1NDU3OTkyNDJjY2MzOTE1MjQzZDM='
    };
    const data = {
      "method": "all",
      "sessionId": id,
      "orderId": id,
      "clientId": "S1_ce1bb1ebebc44fe1a3f7cec976c83ea7",
      "amount": totalPrice,
      "goodsName": "test",
      "returnUrl": "http://localhost:3000/done-order",
      "language": "EN",
      "fakeAuth": "true",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    // console.log('Response:', responseData);
    res.status(200).json({ responseData });
    // 응답 처리 코드 추가

  } catch (error) {
    console.error('Error making order:', error);
    res.status(500).send("오류가 발생하였습니다.");
  }
});


app.post('/:user_id/add', (req, res) => {
  const { user_id } = req.params;
  const { product_id, quantity } = req.body;

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


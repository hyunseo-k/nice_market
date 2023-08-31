const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
// const { useWindowDimensions } = require('react-native-web');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';


const app = express();
const port = 3000; // Choose a port number
var ui;
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'nice_db',
  user: 'root',
  password: 'Rkdgustj7!',
  database: 'nice',
  // insecureAuth: true,
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
    const query = 'INSERT INTO Users (email, password, cart, user_order) VALUES (?, ?, ?, ?)';
    let valuesToInsert= [email,password,"[]","[]"];
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
      user = result[0];
      // res.status(200).json({ message: 'Login successful', user: result[0] });
      const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token, user: result[0] });
    }
  });
});

app.get('/protected', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  const tokenWithoutBearer = token.replace('Bearer ', '');
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Token expired or invalid' });
    } else {
      // 여기서 필요한 작업 수행
      res.status(200).json({ message: 'Protected data accessed', user: decoded.userId });
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
  const { resultMsg, amount, paidAt, goodsName } = req.body;

  if (resultMsg === "정상 처리되었습니다.") {
    const user_id = ui; // 사용자 ID
    const product_name = goodsName; // 상품 이름 --> 추후 조정?

    const order_time = paidAt;

    const updateQuery  = `
      UPDATE Users
      SET user_order = JSON_ARRAY_APPEND(user_order, '$', JSON_OBJECT('amount', ?, 'product_name', ?, 'order_time', ?))
      WHERE user_id = ?
    `;

    db.query(updateQuery, [amount, product_name, order_time, ui], (updateErr, updateResult) => {
      // console.error("amount", ui);
      // console.error("qe", updateResult);
      if (updateErr) {
        console.error('Database update query error:', updateErr);
        res.status(500).json({ message: 'Database error' });
      } else {
        console.log('Update result:', updateResult);
        const selectQuery = 'SELECT * FROM Users WHERE user_id = ?';
    
        db.query(selectQuery, [user_id], (selectErr, selectResult) => {
          if (selectErr) {
            console.error('Database select query error:', selectErr);
            res.status(500).json({ message: 'Database error' });
          } else {
            const updatedUser = selectResult[0];
            console.error("up", updatedUser);
            ////성공하면 장바구니 비우기
            const updateQuery = 'UPDATE Users SET cart = ? WHERE user_id = ?';
            const emptyCart = JSON.stringify([]); // 비워진 카트 데이터를 JSON 문자열로 저장

            db.query(updateQuery, [emptyCart, user_id], (updateError, updateResult) => {
              if (updateError) {
                console.error('Error updating cart:', updateError);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.status(200).json({ message: '결제가 성공적으로 처리되었습니다. 기존 화면으로 돌아가세요.' });
              }
            });
          }
        });
      }
    });
  }
});

app.delete('/cart-delete', (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

    // 데이터베이스에서 해당 사용자의 카트 데이터를 초기화
    const updateQuery = 'UPDATE Users SET cart = ? WHERE user_id = ?';
    const emptyCart = JSON.stringify([]); // 비워진 카트 데이터를 JSON 문자열로 저장

    db.query(updateQuery, [emptyCart, user_id], (error, results) => {
      if (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json({ message: 'Cart deleted successfully' });
      }
    });
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/make-order', async (req, res) => {
  var id = random();
  const { totalPrice, user_id, productName } = req.body;
  ui = user_id
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
      "goodsName": productName,
      "returnUrl": "http://34.64.33.83:3000/done-order",
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


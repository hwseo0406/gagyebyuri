const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 9000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'accountbook'
});

db.connect(err => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Routes
app.get('/api/check-db-connection', (req, res) => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Database connection failed:', err);
            res.status(500).send('Database connection failed');
        } else {
            res.send('Database connection successful');
            console.log('성공');
        }
    });
});

// 수입/지출 분석
app.get('/api/item', async (req, res) => {
    try {
        const query = 'SELECT category AS name, total_cost AS amount FROM receipts';
        const accountQuery = 'SELECT sender_name AS name, amount FROM income';

        // Promise를 사용하여 두 개의 쿼리를 병렬로 실행
        const [itemsResults, accountsResults] = await Promise.all([
            new Promise((resolve, reject) => {
                db.query(query, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(accountQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            })
        ]);

        // 응답 데이터 구조 생성
        const responseData = {
            items: itemsResults,
            accounts: accountsResults
        };

        res.send(responseData);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal server error');
    }
});

// 영수증 데이터 조회 API 엔드포인트
app.get('/api/receipts', (req, res) => {
    const query = 'SELECT category AS name, SUM(total_cost) AS amount FROM receipts GROUP BY category';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal server error');
      } else {
        res.send(results);
      }
    });
  });


// 월별 분석
app.get('/api/semesteranalysis', async (req, res) => {
    try {
        const itemQuery = 'SELECT item_name AS name, amount, item_date AS date FROM items';
        const incomeQuery = 'SELECT sender_name AS name, amount, sender_date AS date FROM income';
        const receiptsQuery = 'SELECT category AS name, total_cost AS amount, purchase_date AS date FROM receipts';

        // Promise를 사용하여 세 개의 쿼리를 병렬로 실행
        const [itemsResults, accountsResults, receiptsResults] = await Promise.all([
            new Promise((resolve, reject) => {
                db.query(itemQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(incomeQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                db.query(receiptsQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            })
        ]);

        // 응답 데이터 구조 생성
        const responseData = {
            items: itemsResults,
            accounts: accountsResults,
            receipts: receiptsResults
        };

        res.send(responseData);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal server error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

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
    database: 'llmdb'
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
        }
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else if (results.length > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const aws = require('aws-sdk');

const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // To allow cross-origin requests if your frontend is hosted elsewhere

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'database-1.c50ki8ii627f.ap-southeast-2.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'rlaqhs135',
    database: 'trip'
});

app.use(express.static(path.join(__dirname, '')));  // Serve static files from 'public' folder

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// Endpoint to get all items
app.get('/items', (req, res) => {
    connection.query('SELECT * FROM trip_plan', (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// Endpoint to add a new item
app.post('/add-item', (req, res) => {
    const { category, place, button_id } = req.body;

    // Add SQL logic to insert the new item with button_id
    const query = `INSERT INTO items (category, place, button_id) VALUES (?, ?, ?)`;
    db.query(query, [category, place, button_id], (error, results) => {
        if (error) {
            console.error("Error adding item:", error);
            res.status(500).send("Error adding item");
        } else {
            res.json({
                id: results.insertId,  // Include the new item ID in the response
                category: category,
                place: place,
                button_id: button_id
            });
        }
    });
});

// Endpoint to delete an item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM trip_plan WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send({ message: 'Item deleted' });
    });
});

// Your other routes...

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

app.listen(443, () => {
    console.log('Server running on port 443');
});
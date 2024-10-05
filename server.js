
const express = require('express');
const app = express(); 
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv'); 

// 
app.use(express.json());
app.use(cors());
dotenv.config(); 

// connection to the database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Check if there is a connection 
db.connect((err) => {
    // If no connection 
    if(err) return console.log("Error connecting to MYSQL");

    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId); 
}) 

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Retrieve all data from database
app.get('/data', (req, res) => {
    db.query('SELECT * FROM patients', (err, patients) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving data')
        } else {
            db.query('SELECT * FROM providers', (err, providers) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error Retrieving data')
                } else {
                    res.render('data', { patients: patients, providers: providers });
                }
            });
        }
    });
});

// Retrieve only names from database
app.get('/data/names', (req, res) => {
    db.query('SELECT first_name FROM patients', (err, patients) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving data')
        } else {
            db.query('SELECT first_name FROM providers', (err, providers) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error Retrieving data')
                } else {
                    res.redirect('/data');
                }
            });
        }
    });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser
    console.log('Sending message to browser...');
    app.get('/', (req, res) => {
        res.send('hi Server Started Successfully!');
    });
});
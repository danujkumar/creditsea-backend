require('dotenv').config();
const express = require('express');
const { connectToDb, getDb } = require('./src/configuration/config');
const port = process.env.PORT || 3000;
const app = express();
const cookieParser = require("cookie-parser");
const router = require("./src/routes/user");
const cors = require('cors');
let db;

const server = require('http').createServer(app);

// db connection
connectToDb((err) => {
    if (!err) {
        server.listen(port, () => {
            console.log('Listen to the port: ' + port);
        });
        db = getDb();
    }
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(router)

//This is the starting point of our application
app.get('/', (req, res) => {
    res.send('Welcome to credit-sea backend system !!');
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Light = require('./routers/Light');

const connectDB = require('./connect/connectDB');
const mqttClient = require('./connect/connectMQTT');  
 

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello from IoT Express server');
});

app.use('/light', Light);


app.listen(3800, () => {
    console.log(`Server is running on http://localhost:${3800}`);
});

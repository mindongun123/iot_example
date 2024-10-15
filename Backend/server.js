const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const Light = require('./routers/Light');
const Temp = require('./routers/Temperature');
const Humi = require('./routers/Humidity');
const Sensor = require('./routers/Sensor');
const Action = require('./routers/Action');

const connectDB = require('./connect/connectDB');
const mqttClient = require('./connect/connectMQTT');


connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.use('/light', Light);
app.use('/temp', Temp);
app.use('/humi', Humi);
app.use('/action', Action);
app.use('/sensor', Sensor);


app.get('/', (req, res) => {
    res.send('Hello from IoT Express server');
});

app.listen(3800, () => {
    console.log(`Server is running on http://localhost:${3800}`);
});

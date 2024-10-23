const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const Sensor = require('./routers/Sensor');
const Action = require('./routers/Action');

const connectDB = require('./connect/connectDB');
const mqttClient = require('./connect/connectMQTT');
const ActionData = require('./db/actionDB');

connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/action', Action);
app.use('/sensor', Sensor);




app.post("/action", async (req, res) => {
    const { device, action } = req.body;

    console.log(device, action);
    try {
        const topic = `iot/action/${device}`;
        const formattedTime = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:${String(new Date().getSeconds()).padStart(2, '0')}`;

        await new Promise((resolve, reject) => {
            mqttClient.publish(topic, action, (err) => {
                if (err) {
                    console.error('Error publishing message:', err);
                    reject(res.status(500).json({ message: "Error publishing message" }));
                } else {
                    resolve();
                }
            });
        });

        res.status(201).json({ message: "Action data saved successfully" });
    } catch (error) {
        console.error("Error saving action data:", error);
        res.status(500).json({ message: "Error saving action data", error });
    }
});



app.get('/', (req, res) => {
    res.send('Hello from IoT Express server');
});



app.listen(3800, () => {
    console.log(`Server is running on http://localhost:${3800}`);
});

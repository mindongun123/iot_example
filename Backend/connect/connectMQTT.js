const mqtt = require('mqtt');

const SensorData = require('../db/sensorDB');
const ActionData = require('../db/actionDB');
const { parse } = require('dotenv');

const mqttServer = 'mqtt://localhost:1993';
const client = mqtt.connect(mqttServer, {
    username: 'dong',
    password: 'b21dccn230'
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    client.subscribe(['iot/sensor', 'iot/action/light1', 'iot/action/light2', 'iot/action/light3', 'iot/action/light4'], (err) => {
        if (!err) {
            console.log('Subscribed to topics: iot/sensor, iot/device/?');
        } else {
            console.error('Failed to subscribe to topics:', err);
        }
    });
});


client.on('message', async (topic, message) => {
    const messageContent = message.toString();
    const formattedTime = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')} ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:${String(new Date().getSeconds()).padStart(2, '0')}`;
    console.log('topic:', topic);

    if (topic === 'iot/sensor') {
        const sensorDataParts = messageContent.split(', ');

        const light = parseFloat(sensorDataParts[0].split(': ')[1]);
        const temperature = parseFloat(sensorDataParts[1].split(': ')[1]);
        const humidity = parseFloat(sensorDataParts[2].split(': ')[1]);
        const datafake = parseFloat(sensorDataParts[3].split(': ')[1]);
        console.log('datafake: ', datafake);

        const sensorDataEntry = new SensorData({
            temperature: temperature,
            humidity: humidity,
            light: light,
            time: formattedTime
        });

        try {
            await sensorDataEntry.save();
            console.log('Sensor data saved to MongoDB successfully/sensor');
        } catch (err) {
            console.error('Error saving sensor data to MongoDB:', err);
        }
    }

    else if (topic === 'iot/action/light1' || topic === 'iot/action/light2' || topic === 'iot/action/light3' || topic === 'iot/action/light4') {

        console.log("Action 4")
        const device = topic.split('/')[2];
        const action = messageContent;

        const actionDataEntry = new ActionData({
            device: device,
            action: action,
            time: formattedTime
        });

        try {
            await actionDataEntry.save();
            console.log('Action data saved to MongoDB successfully/light');
        } catch (err) {
            console.error('Error saving action data to MongoDB:', err);
        }
    }
});
module.exports = client;

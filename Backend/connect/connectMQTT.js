const mqtt = require('mqtt');

// import model data
const LightData = require('../db/lightDB');



const mqttServer = 'mqtt://192.168.1.11';
const client = mqtt.connect(mqttServer, {
    username: 'dong',
    password: 'b21dccn230'
});

let lightData = null;

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('iot/light', (err) => {
        if (!err) {
            console.log('Subscribed to topic: iot/light');
        } else {
            console.error('Failed to subscribe to topic:', err);
        }
    });
});

client.on('message', async (topic, message) => {
    lightData = parseFloat(message.toString());   
    console.log(`[${new Date().toISOString()}] Received data on topic '${topic}': ${lightData}`);

    // Lưu dữ liệu vào MongoDB
    const lightDataEntry = new LightData({ value: lightData });
    try {
        await lightDataEntry.save();
        console.log('Data saved to MongoDB successfully');
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
    }
});

module.exports = client;

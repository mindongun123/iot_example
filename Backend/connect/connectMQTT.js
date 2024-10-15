const mqtt = require('mqtt');

const SensorData = require('../db/sensorDB');
const ActionData = require('../db/actionDB');

const mqttServer = 'mqtt://192.168.1.11:1993';
const client = mqtt.connect(mqttServer, {
    username: 'dong',
    password: 'b21dccn230'
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // can lay action nào thì cứ thêm vào đây 
    // action là topic chảng hạn muốn cập nhật dữ liệu -->> iot/sensor vì cả temp, humi, light đều cần cập nhật cùng lúc, còn iot/action/light1... cập nhật riêng lẽ nên để như này 
    client.subscribe(['iot/sensor', 'iot/action/light1', 'iot/action/light2', 'iot/action/light3'], (err) => {
        if (!err) {
            console.log('Subscribed to topics: iot/sensor, iot/device/?');
        } else {
            console.error('Failed to subscribe to topics:', err);
        }
    });
});

client.on('message', async (topic, message) => {
    const messageContent = message.toString();
    const timestamp = new Date();

    if (topic === 'iot/sensor') {

        // Giả sử dữ liệu từ 'iot/sensor' có dạng: "Light: 23.45, Temperature: 22.30, Humidity: 60.00"
        const sensorDataParts = messageContent.split(', ');

        // Trích xuất các giá trị từ message
        const light = parseFloat(sensorDataParts[0].split(': ')[1]);
        const temperature = parseFloat(sensorDataParts[1].split(': ')[1]);
        const humidity = parseFloat(sensorDataParts[2].split(': ')[1]);

        // Tạo đối tượng lưu vào MongoDB
        const sensorDataEntry = new SensorData({
            temp: temperature,
            humi: humidity,
            light: light,
            timestamp: timestamp
        });

        try {
            await sensorDataEntry.save();
            console.log('Sensor data saved to MongoDB successfully');
        } catch (err) {
            console.error('Error saving sensor data to MongoDB:', err);
        }
    }

    // Xử lý dữ liệu từ topic 'iot/device/action'
    else if (topic === 'iot/action/light1' || topic === 'iot/action/light2' || topic === 'iot/action/light3') {
        const device = topic.split('/')[2]; 
        const action = messageContent;

        // Tạo đối tượng action data để lưu vào MongoDB
        const actionDataEntry = new ActionData({
            device: device,
            action: action,
            timestamp: timestamp
        });

        try {
            await actionDataEntry.save();
            console.log('Action data saved to MongoDB successfully');
        } catch (err) {
            console.error('Error saving action data to MongoDB:', err);
        }
    }
});

module.exports = client;

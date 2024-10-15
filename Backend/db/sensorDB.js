const mongoose = require('mongoose');

const sensorDTSchema = new mongoose.Schema({
    temp: {
        type: Number,
        required: true
    },
    humi: {
        type: Number,
        required: true
    },
    light: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SensorData', sensorDTSchema);

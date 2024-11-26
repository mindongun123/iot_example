const mongoose = require('mongoose');

const sensorDTSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    light: {
        type: Number,
        required: true
    },

    wind: {
        type: Number,
        required: true
    },
    wind1: {
        type: Number,
        required: true
    },
    wind2: {
        type: Number,
        required: true
    },

    time: {
        type: String,
        default: () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        }
    }
});

module.exports = mongoose.model('SensorData', sensorDTSchema);

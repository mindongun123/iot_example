const mongoose = require('mongoose');

const temperatureDTSchema = new mongoose.Schema({
    value: {
        type: Number,  
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TemperatureData', temperatureDTSchema);

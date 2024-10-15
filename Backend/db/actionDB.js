const mongoose = require('mongoose');

const actionDTSchema = new mongoose.Schema({
    device: {
        type: String, 
        required: true
    },
    action: {
        type: String,  
        required: true
    },
    timestamp: {
        type: Date,  
        default: Date.now
    }
});

module.exports = mongoose.model('ActionData', actionDTSchema);

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
    time: {
        type: String, 
        default: () => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        }
    }
});

module.exports = mongoose.model('ActionData', actionDTSchema);

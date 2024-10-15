const express = require("express");
const HumiData = require("../db/humidityDB");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const latestHumiValue = await HumiData.findOne().sort({ timestamp: -1 });

        if (latestHumiValue) {
            res.json({
                value: latestHumiValue.value,
                timestamp: latestHumiValue.timestamp,
            });
        } else {
            res.status(404).json({ message: 'No data available' });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ message: 'Error retrieving data', error });
    }
});

module.exports = router;

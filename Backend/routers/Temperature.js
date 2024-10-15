const express = require("express");
const TemperatureData = require("../db/temperatureDB");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const latestTempValue = await TemperatureData.findOne().sort({ timestamp: -1 });

        if (latestTempValue) {
            res.json({
                value: latestTempValue.value,
                timestamp: latestTempValue.timestamp,
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

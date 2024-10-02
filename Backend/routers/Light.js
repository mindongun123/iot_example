const express = require("express");
const LightData = require("../db/lightDB");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const latestLightValue = await LightData.findOne().sort({ timestamp: -1 });

        if (latestLightValue) {
            res.json({
                value: latestLightValue.value,
                timestamp: latestLightValue.timestamp,
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

const express = require("express");
const SensorData = require("../db/sensorDB");
const router = express.Router();


// moi nhat
router.get("/new", async (req, res) => {
    try {
        const sensorData = await SensorData.findOne().sort({ timestamp: -1 });

        if (sensorData) {
            res.json({
                light: sensorData.light,
                temp: sensorData.temp,
                humi: sensorData.humi,
                timestamp: sensorData.timestamp,
            });
        } else {
            res.status(404).json({ message: "No sensor data available" });
        }
    } catch (error) {
        console.error("Error retrieving sensor data:", error);
        res.status(500).json({ message: "Error retrieving sensor data", error });
    }
});



// tim kiem 
router.get("/search", async (req, res) => {
    const temp = req.query.temp ? parseFloat(req.query.temp) : null;
    const humi = req.query.humi ? parseFloat(req.query.humi) : null;
    const light = req.query.light ? parseFloat(req.query.light) : null;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    let filter = {};

    if (temp !== null) {
        filter.temp = temp;
    }

    if (humi !== null) {
        filter.humi = humi;
    }

    if (light !== null) {
        filter.light = light;
    }

    if (startDate && endDate) {
        filter.timestamp = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
        filter.timestamp = { $gte: startDate };
    } else if (endDate) {
        filter.timestamp = { $lte: endDate };
    }

    try {
        const sensorData = await SensorData.find(filter);

        if (sensorData.length > 0) {
            res.json({
                sensors: sensorData.map(sensor => ({
                    temp: sensor.temp,
                    humi: sensor.humi,
                    light: sensor.light,
                    timestamp: sensor.timestamp,
                })),
            });
        } else {
            res.status(404).json({ message: "No sensor data found with the given conditions" });
        }
    } catch (error) {
        console.error("Error retrieving sensor data:", error);
        res.status(500).json({ message: "Error retrieving sensor data", error });
    }
});



// tat ca
router.get("/", async (req, res) => {
    try {
        const sensorData = await SensorData.find();

        if (sensorData.length > 0) {
            res.json(sensorData);
        } else {
            res.status(404).json({ message: "No sensor data available" });
        }
    } catch (error) {
        console.error("Error retrieving sensor data:", error);
        res.status(500).json({ message: "Error retrieving sensor data", error });
    }
});


module.exports = router;

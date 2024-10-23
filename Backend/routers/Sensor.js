const express = require("express");
const SensorData = require("../db/sensorDB");
const router = express.Router();


router.get("/new", async (req, res) => {
    try {
        const sensorData = await SensorData.findOne().sort({ time: -1 });

        if (sensorData) {
            res.json({
                id: sensorData._id,
                light: sensorData.light,
                temperature: sensorData.temperature,
                humidity: sensorData.humidity,
                time: sensorData.time,
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
    console.log("Query params:");
    console.log(req.query);
    const temperature = req.query.temperature ? parseFloat(req.query.temperature) : null;
    const humidity = req.query.humidity ? parseFloat(req.query.humidity) : null;
    const light = req.query.light ? parseFloat(req.query.light) : null;
    const startDate = req.query.startDate ? (req.query.startDate) : null;
    const endDate = req.query.endDate ? (req.query.endDate) : null;

    let filter = {};

    if (temperature !== null) {
        filter.temperature = temperature;
    }

    if (humidity !== null) {
        filter.humidity = humidity;
    }

    if (light !== null) {
        filter.light = light;
    }

    if (startDate && endDate) {
        filter.time = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
        filter.time = { $gte: startDate };
    } else if (endDate) {
        filter.time = { $lte: endDate };
    }

    try {
        const sensorData = await SensorData.find(filter);

        if (sensorData.length > 0) {
            res.json({
                sensors: sensorData.map(sensor => ({
                    id: sensor._id,
                    temperature: sensor.temperature,
                    humidity: sensor.humidity,
                    light: sensor.light,
                    time: sensor.time,
                })),
            });
        }
        else {
            res.json({ sensors: [], message: "No sensor data found" });
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
            const formattedData = sensorData.map(data => ({
                id: data._id,
                light: data.light,
                temperature: data.temperature,
                humidity: data.humidity,
                time: data.time
            }));

            res.json(formattedData);
        } else {
            res.status(404).json({ message: "No sensor data available" });
        }
    } catch (error) {
        console.error("Error retrieving sensor data:", error);
        res.status(500).json({ message: "Error retrieving sensor data", error });
    }
});


module.exports = router;

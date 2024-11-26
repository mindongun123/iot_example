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

                wind: sensorData.wind,
                wind1: sensorData.wind1,
                wind2: sensorData.wind2,
                
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

    const wind = req.query.wind ? parseFloat(req.query.wind) : null;
    const wind1 = req.query.wind1 ? parseFloat(req.query.wind1) : null;
    const wind2 = req.query.wind2 ? parseFloat(req.query.wind2) : null;

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

    if (wind !== null) {
        filter.wind = wind;
    }

    if (wind1 !== null) {
        filter.wind1 = wind1;
    }

    if (wind2 !== null) {
        filter.wind2 = wind2;
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

                    wind: sensor.wind,
                    wind1: sensor.wind1,
                    wind2: sensor.wind2,

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

                wind: data.wind,
                wind1: data.wind1,
                wind2: data.wind2,

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

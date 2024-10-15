const express = require("express");
const ActionData = require("../db/actionDB");
const router = express.Router();

router.get("/new", async (req, res) => {
    try {
        const action = await ActionData.findOne().sort({ timestamp: -1 });

        if (action) {
            res.json({
                device: action.device,
                action: action.action,
                timestamp: action.timestamp,
            });
        } else {
            res.status(404).json({ message: 'No action data available' });
        }
    } catch (error) {
        console.error("Error retrieving action data:", error);
        res.status(500).json({ message: 'Error retrieving action data', error });
    }
});



/// /search?device=light1
// /search?action=on
// /search?startDate=2021-10-01&endDate=2021-10-10
router.get("/search", async (req, res) => {
    const device = req.query.device ? req.query.device : null;
    const action = req.query.action ? req.query.action : null;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    let filter = {};

    if (device) {
        filter.device = device;
    }

    if (action) {
        filter.action = action;
    }

    if (startDate && endDate) {
        filter.timestamp = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
        filter.timestamp = { $gte: startDate };
    } else if (endDate) {
        filter.timestamp = { $lte: endDate };
    }

    try {
        const actionData = await ActionData.find(filter);

        if (actionData.length > 0) {
            res.json({
                actions: actionData.map(action => ({
                    device: action.device,
                    action: action.action,
                    timestamp: action.timestamp,
                })),
            });
        } else {
            res.status(404).json({ message: "No action data found with the given conditions" });
        }
    } catch (error) {
        console.error("Error retrieving action data:", error);
        res.status(500).json({ message: "Error retrieving action data", error });
    }
});


router.get("/", async (req, res) => {
    try {
        const actions = await ActionData.find();

        if (actions.length > 0) {
            res.json({
                actions: actions.map(action => ({
                    device: action.device,
                    action: action.action,
                    timestamp: action.timestamp,
                })),
            });
        } else {
            res.status(404).json({ message: 'No action data available' });
        }
    } catch (error) {
        console.error("Error retrieving action data:", error);
        res.status(500).json({ message: 'Error retrieving action data', error });
    }
});



module.exports = router;

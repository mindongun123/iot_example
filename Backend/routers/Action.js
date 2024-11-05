const express = require("express");
const ActionData = require("../db/actionDB");
const router = express.Router();






router.get("/search", async (req, res) => {
    console.log("Query:", req.query);
    const device = req.query.device ? req.query.device : null;
    const action = req.query.action ? req.query.action : null;
    const startDate = req.query.startDate ? (req.query.startDate) : null;
    const endDate = req.query.endDate ? (req.query.endDate) : null;

    let filter = {};

    if (device != null) {
        filter.device = device;
    }

    if (action != null) {
        filter.action = action;
    }

    if (startDate && endDate) {
        filter.time = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
        filter.time = { $gte: startDate };
    } else if (endDate) {
        filter.time = { $lte: endDate };
    }

    try {
        const actionData = await ActionData.find(filter);

        if (actionData.length > 0) {
            res.json({
                actions: actionData.map(action => ({
                    id: action._id,
                    device: action.device,
                    action: action.action,
                    time: action.time,
                })),
            });
        } else {
            res.json({ actions: [], message: "No action data found with the given conditions" });
        }
    } catch (error) {
        console.error("Error retrieving action data:", error);
        res.status(500).json({ message: "Error retrieving action data", error });
    }
});



router.get('/aclast', async (req, res) => {
    try {

        const actions1 = await ActionData.find({ device: "light1" }).sort({ time: -1 }).limit(1);
        const actions2 = await ActionData.find({ device: "light2" }).sort({ time: -1 }).limit(1);
        const actions3 = await ActionData.find({ device: "light3" }).sort({ time: -1 }).limit(1);
        const actions4 = await ActionData.find({ device: "light4" }).sort({ time: -1 }).limit(1);

        const actionDevice1 = actions1.length > 0 ? actions1[0].action : "OFF";
        const actionDevice2 = actions2.length > 0 ? actions2[0].action : "OFF";
        const actionDevice3 = actions3.length > 0 ? actions3[0].action : "OFF";
        const actionDevice4 = actions4.length > 0 ? actions4[0].action : "OFF";

        res.json([actionDevice1, actionDevice2, actionDevice3, actionDevice4]);

    } catch (error) {
        console.error("Last Data action Error", error);
        res.status(500).json({ message: 'Error retrieving action data', error });
    }
});


router.get("/", async (req, res) => {
    try {

        const actions = await ActionData.find();

        if (actions.length > 0) {
            const formattedData = actions.map(data => ({
                id: data._id,
                device: data.device,
                action: data.action,
                time: data.time,
            }));

            res.json(formattedData);
        } else {
            res.status(404).json({ message: "No sensor data available" });
        }

    } catch (error) {
        console.error("Error retrieving action data:", error);
        res.status(500).json({ message: 'Error retrieving action data', error });
    }
});





module.exports = router;

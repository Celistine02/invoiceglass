const express = require("express");
const { createDevice, readDevice, lockDevice, unlockDevice } = require("../controllers/device");
const { getDevicesFromMDM } = require("../controllers/retrive");

const router = express.Router();

// Define routes for device operations without authentication middleware
router.post("/devices", createDevice); // Create a new device
router.get("/devices/:deviceId", readDevice); // Retrieve a device by ID
router.get("/mdm/devices", async (req, res) => {
  try {
    const devices = await getDevicesFromMDM();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching devices from MDM", error: error.message });
  }
});

router.post("/devices/:deviceId/lock", lockDevice); // Lock a device by ID
router.post("/devices/:deviceId/unlock", unlockDevice); // Unlock a device by ID

module.exports = router;

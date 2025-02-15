const express = require('express');
const router = express.Router();
const { createDevice, readDevice, updateDevice, deleteDevice } = require('../controllers/crudDevice');

// Route to create a new device
router.post('/device', createDevice);

// Route to get a device by IMEI
router.get('/device', readDevice);

// Route to update a device by IMEI
router.put('/device/:imei', updateDevice);

// Route to delete a device by IMEI
router.delete('/device/:imei', deleteDevice);

module.exports = router;

const express = require("express");
const { createInvoice } = require("../controllers/createInvoice"); // Import the createInvoice controller

const router = express.Router();

// Define the route for creating an invoice
router.post("/create", createInvoice);

module.exports = router; // Export the router

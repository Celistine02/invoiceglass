const express = require("express");
const { createInvoice } = require("../controllers/createInvoice");

const router = express.Router();

// Create Invoice Route
router.post("/create", createInvoice);

module.exports = router;

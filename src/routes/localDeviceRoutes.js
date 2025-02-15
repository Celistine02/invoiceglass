const express = require('express');
const router = express.Router();
const { createInvoice } = require('../controllers/createInvoice'); // Import the createInvoice controller

// Route to create a new invoice
router.post('/invoice/create', createInvoice);

// Route to get all invoices
router.get('/invoices', async (req, res) => {
  // Logic to retrieve all invoices
});

// Route to update an invoice by ID
router.put('/invoice/:id', async (req, res) => {
  // Logic to update an invoice by ID
});

// Route to delete an invoice by ID
router.delete('/invoice/:id', async (req, res) => {
  // Logic to delete an invoice by ID
});

module.exports = router;

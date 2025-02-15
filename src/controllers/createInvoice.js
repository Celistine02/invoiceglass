const Invoice = require("../models/invoice"); // Import the Invoice model

/**
 * Create Invoice Controller
 * This function handles the creation of a new invoice.
 */
const createInvoice = async (req, res) => {
  const { customerName, customerDetails, contact, products, totalPrice, cashierId, cashierName, paymentType } = req.body;

  try {
    // Create a new invoice instance
    const newInvoice = new Invoice({
      customerName,
      customerDetails,
      contact,
      products,
      totalPrice,
      cashierId,
      cashierName,
      paymentType
    });

    // Save the invoice to the database
    await newInvoice.save();

    // Respond with the created invoice
    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

module.exports = { createInvoice }; // Export the createInvoice function

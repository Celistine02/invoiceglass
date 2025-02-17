const Invoice = require("../models/invoice");

/**
 * Create Invoice Controller
 */
const createInvoice = async (req, res) => {
  try {
    const {
      customerName,
      customerDetails,
      contact,
      products,
      cashierId,
      cashierName,
      paymentType,
    } = req.body;

    // Validate request (Check for missing fields)
    if (
      !customerName ||
      !customerDetails ||
      !contact ||
      !products ||
      !cashierId ||
      !cashierName ||
      !paymentType
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products must be an array with at least one item." });
    }

    // Ensure each product has qty and unitPrice
    for (const product of products) {
      if (!product.qty || !product.unitPrice) {
        return res
          .status(400)
          .json({ message: "Each product must have qty and unitPrice." });
      }
    }

    // Create a new invoice (totalPrice will be calculated automatically in the model)
    const newInvoice = new Invoice({
      customerName,
      customerDetails,
      contact,
      products,
      cashierId,
      cashierName,
      paymentType,
    });

    // Save invoice to the database
    await newInvoice.save();

    res.status(201).json({
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating invoice",
      error: error.message,
    });
  }
};

module.exports = { createInvoice };

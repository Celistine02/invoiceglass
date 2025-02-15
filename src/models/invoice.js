const mongoose = require("mongoose");

/**
 * Product Schema
 * This schema defines the structure of a product in an invoice.
 */
const productSchema = new mongoose.Schema({
  qty: { 
    type: Number, 
    required: true 
  }, // Quantity of the product

  description: { 
    type: String, 
    required: true 
  }, // Description of the product

  unitPrice: { 
    type: Number, 
    required: true 
  }, // Unit price of the product

  amount: { 
    type: Number, 
    required: true 
  }, // Amount calculated as qty * unitPrice

  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  } // Reference to the associated customer
});

/**
 * Invoice Schema
 * This schema defines the structure of the Invoice model in the database.
 * It includes fields for customer information and an array of products.
 */
const invoiceSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  }, // Customer's name

  customerDetails: { 
    type: String, 
    required: true 
  }, // Additional details about the customer

  contact: { 
    type: String, 
    required: true 
  }, // Customer's contact information

  date: { 
    type: Date, 
    default: Date.now 
  }, // Date of the invoice

  products: [productSchema], // Array of products in the invoice

  totalPrice: { 
    type: Number, 
    required: true 
  }, // Total price calculated by summing up all product amounts

  cashierId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the cashier handling the invoice

  cashierName: { 
    type: String, 
    required: true 
  }, // Name of the cashier handling the invoice

  paymentType: { // Added payment type field
    type: String,
    enum: ["ecocash", "Cash", "Transfare"], // Allowed payment types
    required: true // Payment type should not be null
  } 
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the Invoice model based on the invoiceSchema
module.exports = mongoose.model("Invoice", invoiceSchema);

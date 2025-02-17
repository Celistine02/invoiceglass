const mongoose = require("mongoose");

// Define the schema for individual products in an invoice
const productSchema = new mongoose.Schema({
  qty: { type: Number, required: true }, // Quantity of the product
  description: { type: String, required: true }, // Product name/description
  unitPrice: { type: Number, required: true }, // Price per unit of the product
  amount: { type: Number, required: true }, // Calculated as qty * unitPrice
});

// Define the schema for invoices
const invoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true }, // Customer's name
    customerDetails: { type: String, required: true }, // Customer's additional details
    contact: { type: String, required: true }, // Contact details
    date: { type: Date, default: Date.now }, // Invoice creation date
    products: { type: [productSchema], required: true }, // List of products in the invoice
    totalPrice: { type: Number, required: true }, // Total price (sum of all product amounts)
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Cashier ID (reference to User)
    cashierName: { type: String, required: true }, // Name of the cashier processing the invoice
    paymentType: {
      type: String,
      enum: ["ecocash", "Cash", "Transfer"],
      required: true,
    }, // Payment method
  },
  { timestamps: true }
);

// Middleware to calculate total price before saving the invoice
invoiceSchema.pre("save", function (next) {
  this.products.forEach((product) => {
    product.amount = product.qty * product.unitPrice; // Ensure amount is calculated correctly
  });

  // Calculate total price as the sum of all product amounts
  this.totalPrice = this.products.reduce(
    (sum, product) => sum + product.amount,
    0
  );

  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);

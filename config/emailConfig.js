const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST, // SMTP server host loaded from environment variables
  port: process.env.SMTP_PORT, // SMTP server port loaded from environment variables
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports, loaded from environment variables
  auth: {
    user: process.env.EMAIL, // Email address loaded from environment variables
    pass: process.env.EMAIL_PASSWORD, // Email password loaded from environment variables
  },
});

module.exports = transporter;

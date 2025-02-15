// paypalClient.js
// Import the PayPal Checkout Server SDK
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

// Create a new environment for the PayPal client
const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
  process.env.PAY_PAL_CLIENT_id, // Client ID from environment variables
  process.env.PAY_PAL_CLIENT_secret // Client secret from environment variables
);

// Initialize the PayPal HTTP client with the environment
const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

// Export the PayPal client for use in other parts of the application
module.exports = { client };

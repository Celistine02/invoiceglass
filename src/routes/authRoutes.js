const express = require("express"); // Import express
const { signin, signup } = require("../controllers/auth"); // Import signin and signup controllers

const router = express.Router(); // Create a new router

// Define the signin route
router.post("/signin", signin);

// Define the signup route
router.post("/signup", signup);

module.exports = router; // Export the router

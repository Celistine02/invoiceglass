const mongoose = require("mongoose");

/**
 * User Schema
 * This schema defines the structure of the User model in the database.
 * It includes fields for user identification, role, and timestamps.
 */
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Unique username for the admin

  password: { 
    type: String, 
    required: true 
  }, // Password for the admin account

  email: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Unique email for the admin

  role: { 
    type: String, 
    enum: ["admin"], 
    default: "admin" 
  }, // Role of the user, only admin is allowed

}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the User model based on the userSchema
module.exports = mongoose.model("User", userSchema);

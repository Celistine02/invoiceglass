const User = require("../models/user"); // Import the User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
//const { signupEmailTemplate, signinEmailTemplate } = require(""); // Import email templates
const sendEmail = require("./../middleware/sendEmail"); // Import email sending service

/**
 * Signin Controller
 * This function handles user signin by verifying the username or email and password.
 */
const signin = async (req, res) => {
  const { identifier, password } = req.body; // Changed username to identifier

  try {
    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }] // Search by username or email
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send signin success email
    const emailContent = signinEmailTemplate(user);
    await sendEmail(user.email, "Sign In Successful", emailContent); // Changed to use user.email

    // Respond with the user data and token
    res.status(200).json({ user: { username: user.username, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Signup Controller
 * This function handles user signup by creating a new user account.
 */
const signup = async (req, res) => {
  const { username, email, password } = req.body; // Added email field

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }); // Check for existing username or email
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword }); // Include email in user creation
    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send signup success email
    const emailContent = signupEmailTemplate(newUser);
    await sendEmail(newUser.email, "Welcome to Our Service!", emailContent); // Changed to use newUser.email

    // Respond with the user data and token
    res.status(201).json({ user: { username: newUser.username, role: newUser.role }, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export the signin and signup controllers
module.exports = { signin, signup };

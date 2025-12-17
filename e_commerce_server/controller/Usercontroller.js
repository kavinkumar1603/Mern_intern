const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating tokens

// Register a new user
// Validates input, checks for existing user, hashes password, and creates a new user record
module.exports.registerStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash the password with a salt round of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in the database
        const user = await User.create({
            email,
            password: hashedPassword
        });
        res.status(201).json({ message: "User Registered Successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Login an existing user
// Validates credentials, checks password, and issues a JWT token
module.exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User Not Found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Password" });
        }

        // Generate a JWT token including userId and email
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECRET_KEY, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration time
        );

        res.status(200).json({ message: "Login Successful", token, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // User's email, must be unique
    password: { type: String, required: true }, // User's hashed password
    role: { type: String, default: 'user' } // User's role (e.g., 'user', 'admin'), defaults to 'user'
});

module.exports = mongoose.model('User', UserSchema);    
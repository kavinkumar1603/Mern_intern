require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware for handling Cross-Origin Resource Sharing
const cartRoutes = require('./routes/cart'); // Import cart routes
const productRoutes = require('./routes/products'); // Import product routes
const authRoutes = require('./routes/auth'); // Import authentication routes

const connectDB = require('./config/db'); // Import database connection function
const authMiddleware = require('./middlewares/AuthMiddleware'); // Import authentication middleware
const User = require('./models/User'); // Import User model
connectDB(); // Connect to the MongoDB database

const app = express(); // Initialize Express application

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON payloads

// Custom middleware to log request method, URL, and timestamp
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next(); // Pass control to the next middleware or route handler
})

// Root route - Basic server check
app.get('/', (req, res) => {
    res.end('Server is running on port 3000');
});

// Import and use order routes
const orderRoutes = require('./routes/orders');

// Define API routes
app.use('/products', productRoutes); // Mount product routes at /products
app.use('/cart', cartRoutes); // Mount cart routes at /cart
app.use('/auth', authRoutes); // Mount auth routes at /auth
app.use('/orders', orderRoutes); // Mount order routes at /orders


// Protected Profile Route
// Uses authMiddleware to verify the token before accessing the route
app.get("/profile", authMiddleware, async (req, res) => {
    // Fetch user by ID from the token payload, excluding the password field
    const user = await User.findById(req.userdata.id).select("-password");
    res.status(200).json({ message: "Profile", userData: user })
})


// Start the server and listen on the defined port
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
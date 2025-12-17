const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions

// Function to connect to the MongoDB database
async function connectDB() {
    try {
        // Attempt to connect to the database using the URL from environment variables
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected successfully');

        // Fix for E11000 duplicate key error: Drop legacy 'id_1' index if it exists
        // This is a specific workaround for a known issue with old indexes on the 'carts' collection
        try {
            await mongoose.connection.collection('carts').dropIndex('id_1');
            console.log('Legacy index id_1 dropped from carts');
        } catch (e) {
            // Index might not exist, which is fine, so we ignore the error
        }
    }
    catch (err) {
        // Log connection errors and exit the process with failure code
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

module.exports = connectDB; // Export the connection function
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET endpoint to fetch all products
// Does NOT require authentication (public route)
router.get('/', async (req, res) => {
    try {
        // Retrieve all product documents from the database
        const products = await Product.find();
        // Return the list of products with a 200 OK status
        res.status(200).json(products);
    } catch (error) {
        // Return a 500 Internal Server Error if something goes wrong
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

module.exports = router;
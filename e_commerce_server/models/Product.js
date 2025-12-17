const mongoose = require('mongoose');

// Define the Product Schema
// Note: Variable name is StudentSchema potentially due to copy-paste, but it represents a Product
const StudentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Unique numeric ID for the product
    name: { type: String, required: true }, // Name of the product
    category: { type: String, required: true }, // Product category
    image: { type: String, required: true }, // URL to the product image
    originalPrice: { type: Number, required: true }, // Original price before discount
    sellingPrice: { type: Number, required: true }, // Actual selling price
    description: { type: String, required: true } // Product description
});

module.exports = mongoose.model('Product', StudentSchema);

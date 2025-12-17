const mongoose = require('mongoose');

// Schema for individual items in the cart
const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
    quantity: { type: Number, required: true, default: 1 } // Quantity of the product
});

// Schema for the Cart
const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Reference to the User who owns the cart
    items: [CartItemSchema] // Array of cart items
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

module.exports = mongoose.model('Cart', CartSchema);
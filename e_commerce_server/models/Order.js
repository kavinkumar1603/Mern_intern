const mongoose = require('mongoose');

// Schema for individual items in an order
const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
    name: { type: String, required: true }, // Name of the product at the time of order
    quantity: { type: Number, required: true }, // Quantity ordered
    price: { type: Number, required: true }, // Price per unit at the time of order
    image: { type: String } // Image URL of the product
});

// Schema for the Order
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who placed the order
    items: [OrderItemSchema], // Array of ordered items
    totalAmount: { type: Number, required: true }, // Total cost of the order
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], // Allowed values for order status
        default: 'Processing' // Default status
    },
    paymentId: { type: String }, // Payment identifier (e.g., transaction ID)
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

module.exports = mongoose.model('Order', OrderSchema);

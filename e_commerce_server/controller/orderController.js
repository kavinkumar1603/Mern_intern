const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Get all orders for the authenticated user
// Retrieves the list of orders belonging to the logged-in user, sorted by most recent first
exports.getOrders = async (req, res) => {
    try {
        const userId = req.userdata.id;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Create a new order (Checkout)
// Processes a new order, validates items, creates an order record, and optionally clears the cart
exports.createOrder = async (req, res) => {
    try {
        const userId = req.userdata.id;
        const { items, totalAmount, paymentId, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items provided for order" });
        }

        // Map incoming items to the schema requirements
        // The Cart controller returns items with '_id' (product ObjectId) and 'productId' (numeric ID).
        // The Order schema expects 'product' (ObjectId).
        const orderItems = items.map(item => ({
            product: item._id || item.product, // Use _id if available (from cart response) or product if already formatted
            name: item.name,
            quantity: item.quantity,
            price: item.price || item.sellingPrice,
            image: item.image
        }));

        const newOrder = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            paymentId,
            shippingAddress,
            status: 'Processing'
        });

        // Optional: Clear user's cart after successful order
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

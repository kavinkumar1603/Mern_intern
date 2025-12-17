const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get Cart
// Fetches the cart for the authenticated user
exports.getCart = async (req, res) => {
    try {
        // Find cart by userId and populate product details
        const cart = await Cart.findOne({ userId: req.userdata.id }).populate('items.product');
        if (!cart) {
            return res.status(200).json([]); // Return empty array if no cart found
        }

        // Transform the data to match frontend expectations (flatten the structure)
        const formattedItems = cart.items.map(item => {
            if (!item.product) return null; // Handle case where product might have been deleted
            return {
                productId: item.product.id, // Custom ID from Product model
                name: item.product.name,
                category: item.product.category,
                image: item.product.image,
                price: item.product.sellingPrice, // Use selling price
                quantity: item.quantity,
                _id: item.product._id // Also send internal ID if needed
            };
        }).filter(item => item !== null); // Filter out null items

        res.status(200).json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Add to Cart
// Adds a product to the user's cart or updates quantity if it already exists
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        // Safely extract userId from token data
        const userId = (req.user && req.user.userId) || (req.userdata && req.userdata.id);

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated or invalid token data" });
        }

        // Input validation
        if (!productId) {
            return res.status(400).json({ message: "ProductId is required" });
        }

        // 1. Find the product using numeric/custom ID
        // Note: We use findOne({ id: ... }) as requested, NOT findById()
        console.log(`Looking up product with id: ${productId}`);
        const product = await Product.findOne({ id: productId });

        if (!product) {
            console.log("Product not found");
            return res.status(404).json({ message: "Product not found" });
        }

        const productObjectId = product._id;
        const qty = Number(quantity) || 1;

        // 2. Find or Create Cart for User
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Cleanup: Remote invalid items (missing product reference due to schema changes)
            if (cart.items && cart.items.length > 0) {
                cart.items = cart.items.filter(item => item.product);
            }

            // Check if product already exists in cart (comparing ObjectIds safe check)
            const itemIndex = cart.items.findIndex(p => p.product && p.product.toString() === productObjectId.toString());

            if (itemIndex > -1) {
                // Product exists, update quantity
                cart.items[itemIndex].quantity += qty;
            } else {
                // Product does not exist, push new item
                cart.items.push({
                    product: productObjectId,
                    quantity: qty
                });
            }
            await cart.save();
        } else {
            // No cart exists, create new one
            cart = await Cart.create({
                userId,
                items: [{
                    product: productObjectId,
                    quantity: qty
                }]
            });
        }

        // Return the updated cart in the format frontend expects
        const updatedCart = await Cart.findById(cart._id).populate('items.product');

        const formattedItems = updatedCart.items.map(item => {
            // Guard against deleted products
            if (!item.product) return null;
            return {
                productId: item.product.id, // Return the numeric ID
                name: item.product.name,
                category: item.product.category,
                image: item.product.image,
                price: item.product.sellingPrice,
                quantity: item.quantity
            };
        }).filter(Boolean);

        res.status(200).json({ message: 'Cart updated', cart: formattedItems });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

// Update Quantity (PATCH)
// Updates the quantity of a specific item in the cart
// Note: Frontend sends 'id' which is the custom numeric ID usually
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const targetId = req.params.id; // Could be numeric productId OR items._id OR product._id

        // Safely extract userId
        const userId = (req.user && req.user.userId) || (req.userdata && req.userdata.id);
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Cleanup invalid items first
        if (cart.items && cart.items.length > 0) {
            cart.items = cart.items.filter(item => item.product);
        }

        // Logic to find the item to update
        let itemIndex = -1;

        // Strategy A: Check if targetId matches a direct item._id (User Request specific)
        if (mongoose.isValidObjectId(targetId)) {
            itemIndex = cart.items.findIndex(p => p._id.toString() === targetId);
        }

        // Strategy B: If not found, targetId might be a Product ID (numeric or ObjectId)
        if (itemIndex === -1) {
            let product;
            // Try numeric lookup
            if (!isNaN(targetId)) {
                product = await Product.findOne({ id: parseInt(targetId) });
            }
            // Try valid ObjectId lookup for Product
            if (!product && mongoose.isValidObjectId(targetId)) {
                product = await Product.findById(targetId);
            }

            if (product) {
                // Find item with this product reference
                itemIndex = cart.items.findIndex(p => p.product.toString() === product._id.toString());
            }
        }

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = Number(quantity);
            await cart.save();

            // Re-fetch to populate for response
            const updatedCart = await Cart.findById(cart._id).populate('items.product');
            const formattedItems = updatedCart.items.map(item => {
                if (!item.product) return null;
                return {
                    productId: item.product.id,
                    name: item.product.name,
                    category: item.product.category,
                    image: item.product.image,
                    price: item.product.sellingPrice,
                    quantity: item.quantity
                };
            }).filter(Boolean);

            res.status(200).json({ message: 'Cart item updated', cart: formattedItems });
        } else {
            res.status(404).json({ message: 'Product/Item not found in cart' });
        }
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};

// Remove Item (DELETE)
// Removes a specific item from the cart
exports.deleteCartItem = async (req, res) => {
    try {
        const targetId = req.params.id;

        // Safely extract userId
        const userId = (req.user && req.user.userId) || (req.userdata && req.userdata.id);
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Logic to find the item to remove (same robust strategy as updateCartItem)
        let itemIndex = -1;

        // Strategy A: Check if targetId matches a direct item._id
        if (mongoose.isValidObjectId(targetId)) {
            itemIndex = cart.items.findIndex(p => p._id.toString() === targetId);
        }

        // Strategy B: If not found, targetId might be a Product ID (numeric or ObjectId)
        if (itemIndex === -1) {
            let product;
            // Try numeric lookup
            if (!isNaN(targetId)) {
                product = await Product.findOne({ id: parseInt(targetId) });
            }
            // Try valid ObjectId lookup for Product
            if (!product && mongoose.isValidObjectId(targetId)) {
                product = await Product.findById(targetId);
            }

            if (product) {
                // Find item with this product reference
                itemIndex = cart.items.findIndex(p => p.product.toString() === product._id.toString());
            }
        }

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();

            // Re-fetch to populate for response
            const updatedCart = await Cart.findById(cart._id).populate('items.product');
            const formattedItems = updatedCart.items.map(item => {
                if (!item.product) return null;
                return {
                    productId: item.product.id,
                    name: item.product.name,
                    category: item.product.category,
                    image: item.product.image,
                    price: item.product.sellingPrice,
                    quantity: item.quantity
                };
            }).filter(Boolean);

            res.status(200).json({ message: 'Product removed from cart', cart: formattedItems });
        } else {
            res.status(404).json({ message: "Product/Item not found in cart" });
        }
    } catch (error) {
        console.error("Delete cart error:", error);
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
};

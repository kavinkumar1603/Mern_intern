const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const authMiddleware = require('../middlewares/AuthMiddleware');

// Protect all cart routes ensuring they are only accessible to authenticated users
router.use(authMiddleware);

// GET endpoint to fetch all cart items
// Maps to cartController.getCart
router.get('/', cartController.getCart);


// POST endpoint to add a product to cart
// Maps to cartController.addToCart
router.post('/', cartController.addToCart);

// PATCH endpoint to update cart item quantity
// Maps to cartController.updateCartItem, expects 'id' parameter
router.patch('/:id', cartController.updateCartItem);

// DELETE endpoint to remove a product from cart
// Maps to cartController.deleteCartItem, expects 'id' parameter
router.delete('/:id', cartController.deleteCartItem);

module.exports = router;

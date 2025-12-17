const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const authMiddleware = require('../middlewares/AuthMiddleware');

// Protect all order routes ensuring they are only accessible to authenticated users
router.use(authMiddleware);

// GET /orders - Fetch user's orders
// Retrieves a history of orders for the logged-in user
router.get('/', orderController.getOrders);

// POST /orders - Create a new order
// Initiates the checkout process to create a new order
router.post('/', orderController.createOrder);

module.exports = router;

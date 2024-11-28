const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// GET all orders with populated user and product details
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'name email')
            .populate('products.product_id', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST a new order
router.post('/', async (req, res) => {
    try {
        const { user_id, products, total_price, status, createdAt } = req.body;

        if (!user_id || !products || !total_price) {
            return res.status(400).json({ error: 'User, products, and total price are required.' });
        }

        const newOrder = new Order({
            user_id,
            products,
            total_price,
            status: status || 'Pending',
            createdAt: createdAt || Date.now(),
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create order', details: err.message });
    }
});

// GET a single order by ID with populated user and product details
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user_id', 'name email') // Populate user details
            .populate('products.product_id', 'name price'); // Populate product details

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.json(order);
    } catch (err) {
        console.error('Error fetching order:', err.message);
        res.status(500).json({ error: 'Failed to fetch order.' });
    }
});


// PUT (update) an order
router.put('/:id', async (req, res) => {
    try {
        const { user_id, products, total_price, status, createdAt } = req.body;

        if (!user_id || !products || !total_price) {
            return res.status(400).json({ error: 'User, products, and total price are required.' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { user_id, products, total_price, status, createdAt },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update order', details: err.message });
    }
});

// DELETE an order
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found.' });
        }
        res.json({ message: 'Order deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order.' });
    }
});

module.exports = router;

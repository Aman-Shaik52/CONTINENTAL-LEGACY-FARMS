const express = require('express');
const Order = require('../models/Order');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Admin: get all orders
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.productId', 'name price image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logged-in user: get my orders
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.productId', 'name price image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create order after checkout
router.post('/', auth, async (req, res) => {
  const { userId, cartItems, totalPrice, shippingAddress } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'cartItems are required' });
  }

  try {
    const order = new Order({
      user: req.user.role === 'admin' && userId ? userId : req.user.id,
      products: cartItems.map((item) => ({
        productId: item.productId || item.product?._id || item.product,
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
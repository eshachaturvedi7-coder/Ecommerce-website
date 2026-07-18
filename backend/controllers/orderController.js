const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create new order (COD or Razorpay)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // User ka cart nikalo
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  // Order items banao cart se
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price,
    image: item.product.images[0]?.url || ''
  }));

  const itemsPrice = cart.totalAmount;
  const shippingPrice = itemsPrice > 500 ? 0 : 50; // 500 se upar free shipping
  const taxPrice = Math.round(itemsPrice * 0.05); // 5% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Order object banao
  const orderData = {
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  };

  // Agar Razorpay payment hai to Razorpay order bhi bana do
  if (paymentMethod === 'Razorpay') {
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // paise mein hota hai (rupees x 100)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    orderData.paymentResult = { razorpay_order_id: razorpayOrder.id };

    const order = await Order.create(orderData);

    return res.status(201).json({
      success: true,
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID
    });
  }

  // COD order — direct save karo, stock kam karo, cart khali karo
  const order = await Order.create(orderData);

  // Product stock update karo
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Cart khali karo
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.status(201).json({ success: true, order });
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Signature verify karo
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }

  // Payment genuine hai — order update karo
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  };
  await order.save();

  // Stock kam karo aur cart khali karo
  const cart = await Cart.findOne({ user: req.user.id });
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }
  if (cart) {
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
  }

  res.status(200).json({ success: true, message: 'Payment verified successfully', order });
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Sirf apna order dekh sake, ya admin ho
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.status(200).json({ success: true, order });
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.orderStatus = orderStatus;
  if (orderStatus === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({ success: true, order });
};